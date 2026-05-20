import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-7b-instruct:free';

export interface AiResponse {
  text: string;
  prompt_tokens: number;
  completion_tokens: number;
}

export async function callAi(prompt: string): Promise<AiResponse> {
  const res = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vishesham.online',
      },
      timeout: 30000,
    }
  );

  const choice = res.data.choices[0];
  return {
    text: choice.message.content.trim(),
    prompt_tokens: res.data.usage?.prompt_tokens ?? 0,
    completion_tokens: res.data.usage?.completion_tokens ?? 0,
  };
}
