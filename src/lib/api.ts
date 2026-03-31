import type { Message } from '@/types/chat';
const BACKEND_URL = '/api/chat';

export const sendMessageStream = async (
  prompt: string,
  history: Message[],
  onChunk: (chunk: string) => void
): Promise<void> => {
  const messages = [
    ...history,
    { role: 'user', content: prompt }
  ];

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, provider: 'gemini' })
    });

    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      
      // OpenAI/Gemini use different stream formats (SSE vs Raw JSON streams)
      // For simplicity, we can do basic parsing as the backend relays raw chunks
      if (chunk.includes('"text":')) { // Gemini
        const matches = chunk.match(/"text":\s*"(.*?)"/g);
        if (matches) {
          for (const match of matches) {
            const text = match.replace(/"text":\s*"/, '').replace(/"$/, '');
            onChunk(text.replace(/\\n/g, '\n').replace(/\\"/g, '"'));
          }
        }
      } else if (chunk.startsWith('data: ')) { // OpenAI
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.replace(/^data: /, ''));
              onChunk(parsed.choices[0]?.delta?.content || '');
            } catch (e) {}
          }
        }
      }
    }
  } catch (error) {
    console.error('[Stream error]', error);
    throw error;
  }
};
