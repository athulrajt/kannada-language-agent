import { config } from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

config()

interface Word {
  kannada: string;
  transliteration: string;
  english: string;
  usageExamples: Array<{
    kannada: string;
    transliteration: string;
    english: string;
  }>;
  tip: string;
}

const USED_WORDS_FILE = path.join(process.cwd(), 'used_words.json')

export function loadUsedWords(): string[] {
  try {
    if (fs.existsSync(USED_WORDS_FILE)) {
      return JSON.parse(fs.readFileSync(USED_WORDS_FILE, 'utf-8'))
    }
    return []
  } catch (error) {
    console.error('Error loading used words:', error)
    return []
  }
}

export function saveUsedWords(words: string[]) {
  try {
    fs.writeFileSync(USED_WORDS_FILE, JSON.stringify(words, null, 2))
  } catch (error) {
    console.error('Error saving used words:', error)
  }
}

export async function generateWordsWithClaude(usedWords: string[]): Promise<Word[]> {
  const prompt = `Generate 5 items that haven't been used before:

1. First 2 items should be:
   - Simple, common Kannada words used in daily life
   - Easy to pronounce and remember
   - Not in this list of used words: ${usedWords.join(', ')}

2. Next 3 items should be:
   - Common banking interactions in Kannada
   - Include both staff questions and customer requests
   - Examples of staff questions:
     * "Do you need a credit card?"
     * "Please sign here"
     * "Please tell OTP"
     * "Please come tomorrow"
   - Examples of customer requests:
     * "I want to deposit cash"
     * "I need monthly bank statement"
     * "I want to open new account"
   - Keep English terms like 'credit card', 'OTP', 'account' as is
   - Make it natural and conversational

Each item should be:
   - Include transliteration in English letters
   - Include 2 usage examples with transliteration
   - Have a helpful tip for remembering

Return a JSON array of 5 objects, each with this exact format:
{
  "kannada": "ಕನ್ನಡಪದ",
  "transliteration": "kannadapada",
  "english": "English meaning",
  "usageExamples": [
    {
      "kannada": "ಉದಾಹರಣೆ೧",
      "transliteration": "udaaharane1",
      "english": "Example 1 in English"
    },
    {
      "kannada": "ಉದಾಹರಣೆ೨",
      "transliteration": "udaaharane2",
      "english": "Example 2 in English"
    }
  ],
  "tip": "A helpful tip to remember this word/phrase"
}

Rules:
1. Return ONLY the JSON array, nothing else
2. Each item must be unique and not in the used words list
3. Make sure the JSON is valid and complete
4. Include transliteration for both the main text and examples
5. Keep the tips short and memorable
6. First 2 items should be simple words, last 3 should be banking interactions
7. Keep English terms like 'credit card', 'OTP', 'account' as is in the Kannada text`;

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
