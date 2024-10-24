import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const apiKey = 'AIzaSyBqxoUIEXWpSA3liZt-GiJAttNFakbNtUc';

const genAI = new GoogleGenerativeAI(apiKey);

app.post('/enhance', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: 'You are a helpful assistant that is very good at writing prompts for generative AI models. Your goal is to enhance all prompt you receive. Remove "Enhance this promt:" from the begining of the prompt and enhance the prompt. do not add anything else to the prompt.' ,
    });
    const result = await model.generateContent(`enhance this prompt: ${prompt}`)
    const response = result.response
    const text = response.text();
    return res.json({enhancePrompt: text});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to enhance prompt' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});