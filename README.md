# TestPortal Helper

TestPortal Helper is a Chrome extension that assists with answering questions on TestPortal by automatically highlighting the first letter of correct answers. The extension uses AI via OpenRouter API to analyze quiz questions and provide assistance.

## Features

- Automatically analyzes test questions using AI
- Bolds the first letter of correct answers to help identify them
- Supports multiple-choice and single-choice questions
- Configurable with different AI models
- Optional web search capability for more accurate answers
- Simple configuration interface accessible via a settings button

## How It Works

1. The extension detects when you're on a TestPortal quiz page
2. It extracts the question and answer options
3. Sends the question to an AI model through OpenRouter
4. Receives and parses the AI's response
5. Automatically bolds the first letter of the correct answer(s)

## Installation

### From Chrome Web Store

_(Coming soon)_

### Manual Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" at the top right
4. Click "Load unpacked" and select the `dist` folder from this repository
5. The extension will now be installed and active

## Configuration

Before using the extension, you need to configure it with your OpenRouter API key:

1. Get your API key from [OpenRouter](https://openrouter.ai/keys)
2. When on a TestPortal page, click the gear icon (⚙️) in the bottom right corner
3. Enter your API key
4. Select your preferred AI model
5. Toggle web search on/off based on your needs
6. Click "Save"

## Models

TestPortal Helper supports a variety of AI models through OpenRouter, including:

- OpenAI GPT-4.1 Mini/GPT-4.1
- Claude 3.5 Sonnet
- Llama 3
- Perplexity Sonar
- Google Gemini
- And more

## Requirements

- Chrome browser (or Chromium-based browser)
- OpenRouter API key

## Privacy and Usage

- Your API key is stored locally in your browser
- Questions and answers are sent to OpenRouter for processing
- If web search is enabled, the questions may be searched online
- Be aware that using this extension may violate the terms of service of educational platforms
- This extension is for educational purposes only

## Development

### Building from Source

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. Make your changes to the code
4. Run `pnpm build-extension` to build the extension

## License

This project is intended for educational purposes only. Use at your own risk.

## Disclaimer

This tool is meant for educational purposes and self-assessment. The author does not endorse cheating on exams or violating academic integrity policies. Users are responsible for adhering to their educational institution's code of conduct and ethics.
