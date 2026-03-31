import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent';

app.post('/api/chat', async (req, res) => {
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

  console.log(`\n[HUB] Request: Provider=${provider}`);

  try {
    // 1. ATTEMPT GEMINI
    if (geminiKey) {
      console.log('[HUB] Trying Gemini...');
      const response = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })) })
      });

      if (response.ok) return await relayStream(response, res);
      
      console.warn(`[HUB] Gemini Rejected (${response.status})`);
      if (response.status === 429 && openAIKey) {
        console.log('[HUB] Rate limited. Falling back to OpenAI...');
      } else if (!openAIKey) {
        throw new Error('Gemini Limit Reached & No OpenAI Key Set');
      }
    }

    // 2. ATTEMPT OPENAI
    if (openAIKey) {
      console.log('[HUB] Trying OpenAI...');
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: messages.map(m => ({ role: m.role, content: m.content })), stream: true })
      });

      if (response.ok) return await relayStream(response, res);
      
      const err = await response.json().catch(() => ({}));
      console.error(`[HUB] OpenAI Rejected: ${err.error?.message || 'Quota Issue'}`);
    }

    // 3. DEMO RESCUE (FAILOVER MOCK)
    console.log('[HUB] 🛡️ RESCUE MODE ACTIVATED');
    res.setHeader('Content-Type', 'text/event-stream');
    const msg = `### ⚠️ API Keys Offline\n\nYou're seeing this because **both** Gemini and OpenAI are currently unavailable.\n\n*   **Gemini**: Rate limited (Free tier)\n*   **OpenAI**: Quota exceeded (Out of credits)\n\nPlease check your billing at [OpenAI Dashboard](https://platform.openai.com/usage) or wait a few minutes for Gemini!`;
    
    // Stream the mock message slowly for effect
    for (const char of msg) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: char } }] })}\n\n`);
      await new Promise(r => setTimeout(r, 5));
    }
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('[HUB CRASH]', error.message);
    res.status(500).json({ error: error.message });
  }
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Hub active: http://localhost:${PORT}`);
});
