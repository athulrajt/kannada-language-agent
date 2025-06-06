import { config } from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import * as claude from './claude'

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

const USED_WORDS_FILE = path.join(__dirname, '../data/used_words.json')

export async function loadUsedWords(): Promise<string[]> {
  try {
    if (fs.existsSync(USED_WORDS_FILE)) {
      const data = await fs.promises.readFile(USED_WORDS_FILE, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error loading used words:', error)
    return []
  }
}

export async function saveUsedWords(words: string[]): Promise<void> {
  try {
    await fs.promises.writeFile(USED_WORDS_FILE, JSON.stringify(words, null, 2))
  } catch (error) {
    console.error('Error saving used words:', error)
  }
}

export async function generateWords(usedWords: string[]): Promise<any[]> {
  const prompt = `Generate 5 new Kannada words/phrases. The first two should be simple/common words, and the last three should be banking-related phrases. Each word/phrase must:
1. Be a single word or phrase (no underscores or spaces in single words)
2. Include transliteration
3. Include English meaning
4. Include THREE DIFFERENT usage examples (not the same as previous emails), each with:
   - Kannada script
   - Transliteration
   - English translation
5. Include a helpful tip for remembering the word

For the banking-related phrases (last 3 items):
- Generate DIFFERENT banking scenarios each time
- Include a mix of:
  * Customer requests (e.g., "I want to transfer money", "I need a bank statement", "I want to update my mobile number")
  * Staff questions (e.g., "Do you have your ID proof?", "Would you like to set up internet banking?", "Have you received the OTP?")
  * Transaction-related phrases (e.g., "Please enter your PIN", "Your transaction is successful", "Please collect your receipt")
- Keep common terms like "credit card", "OTP", "PIN", "ID proof" in English
- Make each example unique and practical for daily banking interactions

Format the response as a JSON array of objects with this structure:
[
  {
    "kannada": "ಕನ್ನಡ_ಪದ",
    "transliteration": "kannada pada",
    "english": "Kannada word",
    "usageExamples": [
      {
        "kannada": "ಉದಾಹರಣೆ ೧",
        "transliteration": "udaaharane 1",
        "english": "Example 1"
      },
      {
        "kannada": "ಉದಾಹರಣೆ ೨",
        "transliteration": "udaaharane 2",
        "english": "Example 2"
      },
      {
        "kannada": "ಉದಾಹರಣೆ ೩",
        "transliteration": "udaaharane 3",
        "english": "Example 3"
      }
    ],
    "tip": "Helpful tip for remembering"
  }
]

Important:
- Each word/phrase must be unique and not in this list: ${JSON.stringify(usedWords)}
- For banking phrases, keep common terms like "credit card" and "OTP" in English
- Make sure each usage example is different and practical
- Ensure the JSON is valid and complete
- Include exactly 3 different usage examples for each word/phrase
- For banking phrases, generate NEW and DIFFERENT scenarios each time, not the same ones as previous emails`;

  return claude.generateWordsWithClaude(prompt);
}
