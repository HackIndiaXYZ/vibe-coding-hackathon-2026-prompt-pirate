# Product Judge AI

Product Judge AI is a web application that evaluates project ideas, pitch decks, and mockups using a board of 6 parallel AI agents running on Gemini Pro.

## Setup & Integration

### Gemini API Configuration

This application integrates with the Gemini API and expects the `GEMINI_API_KEY` environment variable to be configured.

1. Copy the `.env.local.example` file to `.env.local` in the project root:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key.

The server-side integration reads this key via:
```javascript
process.env.GEMINI_API_KEY
```

Make sure not to commit `.env.local` to version control (it is excluded by `.gitignore`).
