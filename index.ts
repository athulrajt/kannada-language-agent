import { generateWords } from './utils/words'
import { sendEmail } from './utils/email'
import { loadUsedWords, saveUsedWords } from './utils/words'
import dotenv from 'dotenv'

dotenv.config()

interface Word {
  kannada: string
  transliteration: string
  english: string
  usageExamples: Array<{
    kannada: string
    transliteration: string
    english: string
  }>
  tip: string
}

async function main() {
  try {
    // Load used words
    const usedWords = await loadUsedWords()
    console.log('📚 Previously used words:', usedWords)

    // Generate new words
    const newWords = await generateWords(usedWords)
    console.log('✨ Generated new words:', newWords)

    // Send email
    await sendEmail(newWords)
    console.log('📧 Email sent successfully')

    // Save new words to used words list
    const updatedUsedWords = [...usedWords, ...newWords.map((w: Word) => w.kannada)]
    await saveUsedWords(updatedUsedWords)
    console.log(' Updated used words list')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()

