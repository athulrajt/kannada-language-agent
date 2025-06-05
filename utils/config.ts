import { config } from 'dotenv'
import path from 'path'

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') })

// Validate required environment variables
const requiredEnvVars = [
  'ANTHROPIC_API_KEY',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_TO'
] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

// Export typed environment variables
export const env = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  email: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
    to: process.env.EMAIL_TO!
  }
} 