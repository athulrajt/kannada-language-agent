import axios, { AxiosError } from 'axios';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env') });

const API_KEY = process.env.ANTHROPIC_API_KEY;

async function testAxios() {
  console.log('API Key:', API_KEY);
  
  const headers = {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  };
  
  console.log('Headers being sent:', headers);
  
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Hello' }]
      },
      { headers }
    );
    console.log('Response:', response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error:', error.response?.data || error.message);
      console.error('Request config:', error.config);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

testAxios(); 