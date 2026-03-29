const express = require('express');
const marked = require('marked');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/ask', async (req, res) => {
  let messages = req.body.messages;
  if (!messages || messages.length === 0) {
    messages = [
      { role: 'system', content: 'You are Grok, a helpful and maximally truthful AI built by xAI. You only answer questions related to technology, programming, software, hardware, and related technical fields. If a question is not about technology, politely decline to answer and suggest rephrasing it to a technology-related topic.' },
      { role: 'user', content: req.body.question }
    ];
  } else {
    // Ensure system message is present
    if (messages[0].role !== 'system') {
      messages.unshift({
        role: 'system',
        content: 'You are Grok, a helpful and maximally truthful AI built by xAI. You only answer questions related to technology, programming, software, hardware, and related technical fields. If a question is not about technology, politely decline to answer and suggest rephrasing it to a technology-related topic.'
      });
    }
  }
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-4-0709', // or latest model, check docs
        messages: messages
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
      res.json({ answer, raw: rawAnswer });
    } else {
      const errorMsg = 'Error: No response from API';
      res.json({ answer: '<p>' + errorMsg + '</p>', raw: errorMsg });
    }
  } catch (error) {
    console.error(error);
    const errorMsg = 'Error: ' + error.message;
    res.json({ answer: '<p>' + errorMsg + '</p>', raw: errorMsg });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});