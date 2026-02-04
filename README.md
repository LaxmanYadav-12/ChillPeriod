# 🎯 ChillPeriod

> **Making student free periods productive without losing academic track**

A dual-platform solution (Discord Bot + Web App) helping college students track attendance, find chill spots, and make smarter use of their free time.

---

## ✨ Features

### Current Features ✅
- **📊 Attendance Tracking** - Monitor class attendance & know when it's safe to skip
- **📍 Chill Spots Finder** - Discover nearby cafés, libraries, and hangout spots
- **🎮 Discord Bot** - 11 slash commands for quick access
- **🌐 Web Dashboard** - Beautiful Next.js interface for managing everything
- **🔐 Authentication** - Secure Discord OAuth integration
- **💾 Unified Database** - Seamless sync between bot and web app

### Coming Soon 🚀
- **🌙 Dark Mode** - Toggle theme preference
- **⭐ Community Reviews** - Rate and review chill spots
- **📈 Attendance Analytics** - Visual charts and trend analysis
- **👥 Study Groups** - Find peers with similar schedules
- **🔔 Push Notifications** - Alerts for attendance thresholds
- **📱 PWA Support** - Installable web app
- **🎮 Gamification** - Streaks, badges, and achievements
- **📢 Chill Feed** - Social updates during free periods
- **📅 Event Calendar** - Campus events and activities

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐
│  Discord Bot    │         │   Next.js Web   │
│  (Discord.js)   │         │      App        │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │
              ┌──────▼──────┐
              │   MongoDB   │
              │  Database   │
              └─────────────┘
```

---

## 🛠️ Tech Stack

### Discord Bot
- **Node.js** 18+ - Runtime environment
- **Discord.js** ^14.14.1 - Discord API wrapper
- **Mongoose** ^8.0.3 - MongoDB ODM
- **dotenv** - Environment configuration

### Web Application
- **Next.js** 16.1.6 - React framework
- **React** 19.2.3 - UI library
- **NextAuth** ^5.0.0-beta - Authentication
- **Tailwind CSS** ^4 - Styling
- **Mongoose** ^9.1.5 - MongoDB ODM

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local installation or Atlas URI)
- Discord Bot Token ([Create one here](https://discord.com/developers/applications))

### Installation

#### 1️⃣ Discord Bot Setup

```bash
# Navigate to bot directory
cd chillperiod-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env`:**
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=your_test_server_id
MONGODB_URI=mongodb://localhost:27017/chillperiod
```

**Deploy commands & start:**
```bash
npm run deploy    # Deploy slash commands
npm run dev       # Start with auto-reload
```

#### 2️⃣ Web App Setup

```bash
# Navigate to web directory
cd chillperiod-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

**Configure `.env.local`:**
```env
MONGODB_URI=mongodb://localhost:27017/chillperiod
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_random_secret_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

**Start development server:**
```bash
npm run dev       # Opens on http://localhost:3000
```

---

## 🎮 Discord Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/ping` | Check bot latency | `/ping` |
| `/help` | View all commands | `/help` |
| `/setcollege` | Set your college | `/setcollege BPIT` |
| `/addcourse` | Add course to track | `/addcourse DSA 75` |
| `/attend` | Mark attendance | `/attend DSA` |
| `/attendance` | View summary | `/attendance` |
| `/setattendance` | Manually set counts | `/setattendance DSA 45 60` |
| `/bunk` | Calculate safe bunks | `/bunk DSA` |
| `/addspot` | Submit new spot | `/addspot CCD Cafe` |
| `/findspots` | Find nearby spots | `/findspots cafe` |
| `/spotinfo` | Get spot details | `/spotinfo CCD` |

---

## 📁 Project Structure

```
AntiGrav_Proj/
├── chillperiod-bot/          # Discord Bot
│   ├── src/
│   │   ├── commands/         # 11 slash commands
│   │   ├── events/           # Event handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── utils/            # Helper functions
│   │   └── index.js          # Entry point
│   ├── config/
│   │   └── colleges.json     # College presets
│   └── package.json
│
└── chillperiod-web/          # Next.js Web App
    ├── src/
    │   ├── app/
    │   │   ├── page.js       # Homepage
    │   │   ├── login/        # Auth pages
    │   │   ├── attendance/   # Attendance dashboard
    │   │   ├── spots/        # Spots explorer
    │   │   └── api/          # API routes
    │   ├── components/       # UI components
    │   ├── models/           # DB schemas
    │   └── auth.js           # NextAuth config
    └── package.json
```

---

## 🗄️ Database Schema

### User
```javascript
{
  discordId: String,
  username: String,
  college: String,
  courses: Array
}
```

### Attendance
```javascript
{
  userId: ObjectId,
  courseName: String,
  totalClasses: Number,
  attendedClasses: Number,
  requiredPercentage: Number,
  lastUpdated: Date
}
```

### Spot
```javascript
{
  name: String,
  type: String,
  location: Object,
  college: String,
  addedBy: ObjectId,
  rating: Number,
  reviews: Array
}
```

---

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Discord bot with slash commands
- [x] Web app with authentication
- [x] Attendance tracking system
- [x] Chill spots discovery
- [x] MongoDB integration

### Phase 2: Enhanced UX 🚧
- [ ] Dark mode toggle
- [ ] Mobile responsive design
- [ ] Loading states & animations
- [ ] Error handling pages

### Phase 3: Community Features 📅
- [ ] Spot reviews & ratings
- [ ] Study group finder
- [ ] Chill feed (social updates)
- [ ] User profiles

### Phase 4: Advanced Analytics 🔮
- [ ] Attendance trend charts
- [ ] Personalized spot recommendations
- [ ] Predictive bunking alerts
- [ ] Campus heatmaps

### Phase 5: Production Ready 🏭
- [ ] TypeScript migration
- [ ] Unit & integration tests
- [ ] CI/CD pipeline
- [ ] Docker deployment
- [ ] PWA support

---

## 🤝 Contributing

Contributions are welcome! This project is built for students, by students.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

Made with ❤️ by [Tony](https://github.com/DarkModeTony)

---

## 🙏 Acknowledgments

- Inspired by the student community's need for better time management
- Built with modern web technologies
- Special thanks to all contributors

---

## 📬 Support

Having issues? [Open an issue](https://github.com/yourusername/chillperiod/issues) or reach out on Discord!

**Happy Chilling! 🎉**
