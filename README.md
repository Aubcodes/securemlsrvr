# Webmail-style Login (Educational Lab)

This project demonstrates a web form that sends a **verification payload** to a Telegram bot via a Next.js API route.

## Environment Variables (Vercel)
Add these in Vercel Project Settings → Environment Variables (Production) and **Redeploy**:

- `TG_BOT_TOKEN` = your bot token from BotFather
- `TG_CHAT_ID` = numeric chat id

## Important
For safety, the API does **not** transmit raw passwords. It sends a SHA-256 hash + length instead, which is enough to confirm end-to-end delivery in a lab.

## Local Dev
```bash
npm install
npm run dev
```
Then open: http://localhost:3000/?email=test@example.com
