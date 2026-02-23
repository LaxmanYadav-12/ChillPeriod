# ChillPeriod 🧊📚

**Bunk Smarter. Chill Better.**

ChillPeriod is a student-centric platform for managing attendance, discovering chill spots, and coordinating bunks with your squad — available as both a **web app** and a **Discord bot**.

[![Live Site](https://img.shields.io/badge/🌐_Live-chillperiod.in-8b5cf6?style=for-the-badge)](https://https://chill-period.vercel.app/)
[![Discord Bot](https://img.shields.io/badge/🤖_Discord-Add_Bot-5865F2?style=for-the-badge)](https://discord.com/oauth2/authorize?client_id=1468284051839520848&permissions=8&scope=bot+applications.commands)

---

## 🚀 What's Inside

This is a **monorepo** with two packages:

| Package | Description | Tech |
|---------|-------------|------|
| [`chillperiod-web`](./chillperiod-web) | Next.js web application | Next.js 16, MongoDB, Auth.js |
| [`chillperiod-bot`](./chillperiod-bot) | Discord bot with 16 slash commands | Discord.js 14, MongoDB |

Both share the **same MongoDB database** with synchronized schemas.

---

## ✨ Key Features

### 📊 Smart Attendance
- Per-course tracking with **Safe / Caution / Danger** zones
- **Mass Bunk** mode with cascading notifications to followers
- Automatic bunk titles (Rookie → Bunk Legend 👑)

### 📚 SyllabusX Integration
- Real-time B.Tech syllabus from [SyllabusX](https://syllabusx.live)
- Progress tracking with interactive checkboxes
- One-click access to notes, PYQs, and books

### 📍 Chill Spots
- Crowdsourced cafes, parks, and gaming zones near campus
- Upvote/downvote system to highlight the best places
- Google Maps integration

### 🤖 Discord Bot (16 Commands)
- `/attendance` `/attend` `/bunk` — Track from Discord
- `/massbunk` — Alert the whole server with join buttons
- `/excuse` — Generate random Hinglish excuses 😂
- `/leaderboard` — Top bunkers at your college
- `/profile` — View rich attendance profiles
- `/findspots` `/addspot` `/spotinfo` — Spots system
- And more! Use `/help` to see all commands

### 👥 Social Features
- Follow friends, see their bunk activity
- Cascading mass bunk notifications
- Public/private profile controls

### 📋 Tasks & Productivity
- Manage to-do lists specifically tied to courses
- Focus mode with built-in **Pomodoro Timer**
- Weekly productivity analytics and completion rates

### 🔔 Smart Notifications
- Push Notifications for follower alerts and bunk invites
- Cross-platform alerts: web ↔ Discord
- In-app notification center

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Vanilla CSS with CSS Variables (light/dark mode) |
| **Backend** | Next.js API Routes, Discord.js 14 |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | Auth.js v5 (Google + Discord OAuth) |
| **Deployment** | Vercel (web) |

---

## ⚡ Quick Start

### Web App
```bash
cd chillperiod-web
npm install
cp .env.example .env.local  # Add your credentials
npm run dev
```

### Discord Bot
```bash
cd chillperiod-bot
npm install
cp .env.example .env  # Add your credentials
npm run deploy         # Register slash commands
npm run dev            # Start the bot
```

### Environment Variables

**Web** (`.env.local`):
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
DISCORD_CLIENT_ID=your_discord_id
DISCORD_CLIENT_SECRET=your_discord_secret
```

**Bot** (`.env`):
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_test_server_id
MONGODB_URI=your_mongodb_uri
```

---

## 🤝 Contributing

PRs welcome! Fork → Branch → Commit → Push → Pull Request.

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

*Built with ❤️ (and a few bunks) by [Tony](https://github.com/DarkModeTony)*
