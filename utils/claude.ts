import { config } from 'dotenv'
config()
import axios from 'axios'

interface Word {
  kannada: string;
  english: string;
}

export async function summarizeWithClaude(word: Word) {
  const prompt = `
You are a Kannada language tutor. Help a bank employee learn Kannada by providing the following information in a complete, valid JSON object:
1. Kannada word: ${word.kannada}
2. English translation: ${word.english}
3. Two simple usage examples in Kannada with English translation.
4. A tip on how to remember or use the word in context.

Return ONLY a complete JSON object in the following format, with no additional text or explanation:
{
  "kannada": "...",
  "english": "...",
  "usageExamples": [
    {
      "kannada": "...",
      "english": "..."
    },
    {
      "kannada": "...",
      "english": "..."
    }
  ],
  "tip": "..."
}
  `.trim()

  const res = await axios.post("https://api.anthropic.com/v1/messages", {
    model: "claude-3-5-haiku-20241022",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    }
  })

  const text = res.data.content[0].text
  console.log('Claude raw response:', text)
  const jsonStart = text.indexOf("{")
  const jsonEnd = text.lastIndexOf("}") + 1
  let json = text.slice(jsonStart, jsonEnd)
  try {
    return JSON.parse(json)
  } catch (err) {
    console.error('Failed to parse Claude JSON:', err)
    console.error('Extracted JSON string:', json)
    return {
      kannada: word.kannada,
      english: word.english,
      usageExamples: [],
      tip: "Failed to parse Claude response."
    }
  }
}

export async function generateWordsWithClaude(prompt: string): Promise<any[]> {
  const headers = {
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  };

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      { headers }
    );

    const content = response.data.content[0].text;
    console.log('Claude raw response:', content);

    try {
      const words = JSON.parse(content);
      if (!Array.isArray(words) || words.length !== 5) {
        throw new Error('Response is not an array of 5 items');
      }
      return words;
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      throw new Error('Failed to parse Claude response as JSON');
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

export default {
  summarizeWithClaude,
  generateWordsWithClaude
}
