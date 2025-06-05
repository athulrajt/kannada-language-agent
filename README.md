# Kannada Language Learning Agent

This project automatically generates and emails Kannada words and banking phrases daily.

## Setup Instructions

### 1. GitHub Repository Setup

1. Create a new GitHub repository
2. Push this code to the repository
3. Go to repository Settings > Secrets and Variables > Actions
4. Add the following secrets:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password (see below)
   - `EMAIL_TO`: The email address to receive the words

### 2. Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled
4. Go to App Passwords
5. Select "Mail" and "Other (Custom name)"
6. Name it "Kannada Language Agent"
7. Copy the generated password and use it as `EMAIL_PASS`

### 3. Verify Setup

1. Go to your repository's Actions tab
2. You should see the "Daily Kannada Words" workflow
3. You can manually trigger it using the "Run workflow" button
4. Check your email to verify it's working

## How It Works

- The script runs daily at 9:15 AM IST
- Generates 5 new Kannada words/phrases:
  - 2 simple/common words
  - 3 banking-related phrases
- Sends an email with:
  - Kannada script
  - Transliteration
  - English meaning
  - Usage examples
  - Memory tips

## Manual Testing

To test locally:
```bash
npm install
npm start
```

## Troubleshooting

1. Check GitHub Actions logs if emails aren't being sent
2. Verify your Gmail app password is correct
3. Ensure all secrets are properly set in GitHub

## 🔥 Features
- Sends 5 new Kannada words every morning
- Claude generates usage, memory tips, and translations
- Optional audio file per word
- Sends via Gmail

## 🛠 Setup
1. `npm install`
2. Copy `.env.example` → `.env` and add your credentials
3. `npx tsx index.ts`

## ✨ Future Ideas
- WhatsApp delivery
- Interactive chatbot mode
- Multiple user support
