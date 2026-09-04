# IFA Welcome & Departure Bot

Browser-friendly Discord.js v14 bot for the Imperial Football Association.

## Setup
1. Create a Discord application and add a Bot.
2. Enable **Server Members Intent** under Bot > Privileged Gateway Intents.
3. Copy `.env.example` to `.env` and add:
   DISCORD_TOKEN=your_bot_token
   CLIENT_ID=your_application_id
4. Run `npm install`
5. Run `npm run deploy`
6. Run `npm start`

## Commands
/setup welcome #channel
/setup goodbye #channel
/welcome-preview
/goodbye-preview

The bot uses `assets/ifa-banner.png`, supplied by the IFA owner, as the banner background.
