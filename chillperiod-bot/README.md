# 🎯 ChillPeriod Discord Bot

A student-centric Discord bot that helps college students make smarter use of their free time—especially during skipped or free classes—without losing track of their academics.

## Features

### Current (Phase 1)
- ✅ Basic bot structure with slash commands
- ✅ MongoDB integration
- ✅ `/ping` - Check bot latency
- ✅ `/help` - View all commands

### Coming Soon
- 📍 **Chill Spots** - Find nearby cafés, libraries, and hangout spots
- 📊 **Attendance Tracker** - Know when it's safe to skip class
- 💬 **Community Reviews** - Student-submitted spot ratings
- 📢 **Chill Feed** - Social updates for free periods

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Discord Bot Token

### Installation

1. **Clone and install dependencies**
   ```bash
   cd chillperiod-bot
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values:
   - `DISCORD_TOKEN` - Your bot token
   - `CLIENT_ID` - Your application client ID
   - `GUILD_ID` - Your test server ID (for dev)
   - `MONGODB_URI` - MongoDB connection string

3. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

4. **Start the bot**
   ```bash
   npm run dev
   ```

## Project Structure

```
chillperiod-bot/
├── src/
│   ├── commands/         # Slash commands
│   ├── events/           # Discord event handlers
│   ├── models/           # MongoDB schemas
│   ├── utils/            # Helper functions
│   ├── deploy-commands.js
│   └── index.js
├── config/
│   └── colleges.json     # Pre-defined colleges
├── .env
└── package.json
```

## Commands

| Command | Description |
|---------|-------------|
| `/ping` | Check bot latency |
| `/help` | View all commands and features |

## Contributing

This bot is built for students, by students. Feel free to contribute!

## License

MIT
