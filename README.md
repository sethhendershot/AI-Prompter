# AI Prompter

A simple Node.js Express webapp that allows users to ask questions to Grok AI via a web interface.

## Features

- Web form with a textbox for entering questions
- Submits to Grok's API and displays the answer
- Uses EJS for templating
- Environment variables for API key security

## Setup

1. Clone or download the project.
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your xAI API key:
   ```
   XAI_API_KEY=your_actual_api_key_here
   ```
   Get your API key from [xAI Console](https://console.x.ai/).
4. Run the app: `npm start`
5. Open your browser to `http://localhost:3000`

## Usage

- Enter your question in the textbox.
- Click Submit.
- The answer from Grok will be displayed below the form.