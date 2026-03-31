import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Vercel Serverless Function Wrapper
export default async function handler(req, res) {
  // Add CORS headers for production
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, provider = 'gemini' } = req.body;
  
  const getValidKey = (key1, key2) => {
    const val1 = process.env[key1];
    const val2 = process.env[key2];
    if (val1 && val1.length > 20 && !val1.includes('your_')) return val1;
    if (val2 && val2.length > 20 && !val2.includes('your_')) return val2;
    return null;
  };

  const openAIKey = getValidKey('OPENAI_API_KEY', 'VITE_OPENAI_API_KEY');
  const geminiKey = getValidKey('GEMINI_API_KEY', 'VITE_GEMINI_API_KEY');

  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent';

  try {
    // 1. ATTEMPT GEMINI
    if (geminiKey) {
      const response = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })) })
      });

      if (response.ok) return await relayStream(response, res);
      
      if (response.status === 429 && openAIKey) {
        // Fallback handled below
      } else if (!openAIKey) {
        throw new Error('Gemini Limit Reached');
      }
    }

    // 2. ATTEMPT OPENAI
    if (openAIKey) {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: messages.map(m => ({ role: m.role, content: m.content })), stream: true })
      });

      if (response.ok) return await relayStream(response, res);
      const err = await response.json().catch(() => ({}));
      throw new Error(`AI Error: ${err.error?.message || 'Quota Issue'}`);
    }

    // 3. DEMO RESCUE (FAILOVER MOCK)
    const msg = `### ⚠️ API Offline\nPlease check your billing at [OpenAI](https://platform.openai.com/usage) or wait for Gemini!`;
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: msg } }] })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function relayStream(response, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
  } finally {
    res.end();
  }
}
