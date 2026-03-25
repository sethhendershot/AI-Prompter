const express = require('express');
const marked = require('marked');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-4-0709', // or latest model, check docs
        messages: [
          { role: 'system', content: 'You are Grok, a helpful and maximally truthful AI built by xAI. You only answer questions related to technology, programming, software, hardware, and related technical fields. If a question is not about technology, politely decline to answer and suggest rephrasing it to a technology-related topic.' },
          { role: 'user', content: question }
        ]
      })
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text}`);
    }
    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const rawAnswer = data.choices[0].message.content;
      const answer = marked.parse(rawAnswer);
      res.json({ answer });
    } else {
      res.render('index', { answer: '<p>Error: No response from API</p>' });
    }
  } catch (error) {
    console.error(error);
    res.json({ answer: '<p>Error: ' + error.message + '</p>' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});