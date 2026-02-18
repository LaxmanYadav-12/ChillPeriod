# ChillPeriod Web 🌐

The web application for ChillPeriod — track attendance, discover chill spots, manage your academic life.

[![Live](https://img.shields.io/badge/Live-chillperiod.in-8b5cf6)](https://chillperiod.in)

---

## ✨ Features

### 📊 Attendance Tracker
- **Per-course tracking** with visual progress bars
- **Safety status**: 🟢 Safe / 🟡 Caution / 🔴 Danger zones
- **Bunk calculator**: Know exactly how many classes you can skip
- **Mass Bunk**: One-click bunk + cascading alerts to followers

### 📚 SyllabusX Integration
- Real-time B.Tech syllabus from [SyllabusX](https://syllabusx.live)
- Interactive progress checkboxes (persisted via localStorage)
- Unit-wise Theory & Lab breakdown
- Direct links to notes, PYQs, and books

### 📍 Chill Spots
- Crowdsourced cafes, parks, gaming zones near campus
- Upvote (🔥) / Downvote (👎) system
- Google Maps integration
- Admin controls for moderation

### 👥 Social & Profiles
- Follow friends, track their bunk activity
- Public/private profile toggle
- Bunk titles: Rookie 🌱 → Bunk Legend 👑
- Account management with Delete Account option

### 🔔 Notifications
- Mass bunk cascade alerts
- New follower notifications
- Bunk join notifications
- Slide-out notification panel

### 📅 Timetable
- Auto-populated by selecting Semester & Section
- Today's schedule at a glance

### 🛡️ Privacy & Security
- Terms & Conditions + Privacy Policy
- Full data ownership with deletion options
- Minimal data collection

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | React 19, Vanilla CSS with CSS Variables |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose) |
| **Auth** | [Auth.js v5](https://authjs.dev/) (Google + Discord OAuth) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router pages & API
│   ├── api/            # REST API routes
│   │   ├── attendance/ # Mark, fetch attendance
│   │   ├── notifications/ # Mass bunk, follow alerts
│   │   ├── spots/      # CRUD + voting
│   │   └── users/      # Profile, social
│   ├── attendance/     # Attendance dashboard
│   ├── spots/          # Spots discovery page
│   ├── profile/        # User profile
│   ├── syllabus/       # SyllabusX integration
│   ├── docs/           # Documentation page
│   ├── privacy/        # Privacy policy
│   └── terms/          # Terms & conditions
├── components/         # Reusable UI components
├── lib/                # Utilities & DB
│   ├── data/           # Static data (excuses, timetable)
│   └── models/         # Mongoose schemas
└── models/             # Additional models (Spot, Notification)
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
cd chillperiod-web
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
DISCORD_CLIENT_ID=your_discord_id
DISCORD_CLIENT_SECRET=your_discord_secret
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🤝 Contributing

PRs are welcome! Fork → Branch → Commit → PR.

## 📄 License

MIT — see [LICENSE](../LICENSE)

---

*Built with ❤️ by [Tony](https://github.com/DarkModeTony)*
