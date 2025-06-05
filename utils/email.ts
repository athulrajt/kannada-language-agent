import nodemailer from 'nodemailer'
import { env } from './config'
import { config } from 'dotenv'
import fs from 'fs'

config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

interface Word {
  kannada: string
  transliteration: string
  english: string
  usageExamples: {
    kannada: string
    transliteration: string
    english: string
  }[]
  tip: string
}

export async function sendEmail(words: Word[]) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .header h1 {
          color: #2c3e50;
          margin: 0;
          font-size: 24px;
        }
        .word-section {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .transliteration {
          font-size: 32px;
          color: #2c3e50;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .kannada-word {
          font-size: 24px;
          color: #666;
          margin-bottom: 10px;
        }
        .english-word {
          font-size: 20px;
          color: #34495e;
          margin-bottom: 15px;
          font-weight: 500;
        }
        .examples {
          background-color: #fff;
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
        }
        .example {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .example:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .example .transliteration {
          font-size: 24px;
          margin-bottom: 3px;
        }
        .example .kannada-word {
          font-size: 20px;
          margin-bottom: 5px;
        }
        .tip {
          background-color: #e8f4f8;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
          color: #2980b9;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Daily Kannada Word</h1>
        </div>
        ${words.map(word => `
          <div class="word-section">
            <div class="transliteration">${word.transliteration}</div>
            <div class="kannada-word">${word.kannada}</div>
            <div class="english-word">${word.english}</div>
            
            <div class="examples">
              <h3 style="color: #2c3e50; margin-top: 0;">Usage Examples:</h3>
              ${word.usageExamples.map(example => `
                <div class="example">
                  <div class="transliteration">${example.transliteration}</div>
                  <div class="kannada-word">${example.kannada}</div>
                  <div style="color: #666;">${example.english}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="tip">
              <strong>💡 Tip:</strong> ${word.tip}
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Keep learning and exploring the beautiful Kannada language!</p>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Your Daily Kannada Word',
    html: emailHtml
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Email sent')
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw error
  }
}
