# ChillPeriod Discord Bot 🤖

A Discord bot with **16 slash commands** for tracking attendance, finding chill spots, generating excuses, and coordinating mass bunks — synced with the [ChillPeriod web app](https://chillperiod.in).

[![Add to Discord](https://img.shields.io/badge/Add_to_Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/oauth2/authorize?client_id=1468284051839520848&permissions=8&scope=bot+applications.commands)

---

## 🎮 All 16 Commands

### 📊 Attendance
| Command | Description |
|---------|-------------|
| `/addcourse` | Add a course to track |
| `/removecourse` | Remove a course |
| `/attend` | Mark a class as attended |
| `/bunk` | Mark a class as bunked |
| `/attendance` | View your attendance dashboard |
| `/setattendance` | Set attendance manually |

### 🚨 Social & Bunking
| Command | Description |
|---------|-------------|
| `/massbunk` | Announce a mass bunk with join buttons |
| `/leaderboard` | View top bunkers at your college |
| `/profile` | View your or someone's profile |
| `/excuse` | Generate a random Hinglish excuse |

### 📍 Chill Spots
| Command | Description |
|---------|-------------|
| `/addspot` | Add a new chill spot |
| `/findspots` | Find spots near campus |
| `/spotinfo` | Get details about a spot |

### 🔧 Utility
| Command | Description |
|---------|-------------|
| `/setcollege` | Set your college |
| `/ping` | Check bot latency |
| `/help` | Show all commands |

---

## ✨ Highlights

- **🚨 Mass Bunk Alerts** — Announce bunks with interactive "I'm In!" buttons. Followers also get notified on the web app
- **😂 Excuse Generator** — Random excuses in 5 tones: funny, serious, medical, professional, dramatic (Hinglish)
- **🏆 Bunk Leaderboard** — Top 10 bunkers at your college with bunk titles (Rookie → Bunk Legend 👑)
- **👤 Rich Profiles** — Visual progress bar, course breakdown, streaks, social stats
- **🔄 Synced with Web** — Same database as [chillperiod.in](https://chillperiod.in), data flows both ways

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | [Discord.js 14](https://discord.js.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose) |
| **Commands** | Slash Commands (Application Commands API) |

---

## 📁 Project Structure

```
chillperiod-bot/
├── src/
│   ├── commands/          # 16 slash commands
│   │   ├── addcourse.js
│   │   ├── attend.js
│   │   ├── attendance.js
│   │   ├── bunk.js
│   │   ├── excuse.js
│   │   ├── findspots.js
│   │   ├── help.js
│   │   ├── leaderboard.js
│   │   ├── massbunk.js
│   │   ├── ping.js
│   │   ├── profile.js
│   │   ├── removecourse.js
│   │   ├── setattendance.js
│   │   ├── setcollege.js
│   │   ├── spotinfo.js
│   │   └── addspot.js
│   ├── data/
│   │   └── excuses.js     # Excuse database (Hinglish)
│   ├── events/            # Discord event handlers
│   ├── models/            # MongoDB schemas (synced with web)
│   │   ├── User.js
│   │   ├── Spot.js
│   │   └── Notification.js
│   ├── utils/
│   │   └── embed.js       # Embed builder utilities
│   ├── deploy-commands.js # Register commands with Discord
│   └── index.js           # Bot entry point
├── config/
│   └── colleges.json
├── .env.example
└── package.json
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd chillperiod-bot
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=your_test_server_id
MONGODB_URI=your_mongodb_uri
```

### 3. Deploy Commands
```bash
npm run deploy
```

### 4. Start the Bot
```bash
npm run dev
```

---

## 🌐 Hosting

| Platform | Cost | Best For |
|----------|------|----------|
| [Railway.app](https://railway.app) | Free $5/mo | Easiest setup, auto-deploy |
| [Render.com](https://render.com) | Free tier | Background workers |
| [Oracle Cloud](https://cloud.oracle.com) | Free forever | Always-on VM |
| Your PC | Free | Development only |

> **Note:** Discord bots need to run 24/7 — they can't be deployed to serverless platforms like Vercel.

---

## 🤝 Contributing

PRs welcome! Fork → Branch → Commit → PR.

## 📄 License

MIT — see [LICENSE](../LICENSE)

---

*Built with ❤️ by [Tony](https://github.com/DarkModeTony)*
