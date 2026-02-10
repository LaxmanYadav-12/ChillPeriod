# ChillPeriod 🎓

### The Ultimate Campus Life Assistant

ChillPeriod is your go-to companion for managing academic life without the stress. Track attendance, calculate safe bunks, sync your timetable, and discover the best chill spots near campus—all in one place.

![ChillPeriod Dashboard](https://via.placeholder.com/800x400.png?text=ChillPeriod+Dashboard+Preview)

## 🚀 Key Features

### 📊 Attendance Tracker
*   **Per-Course Progress**: Visual bars show exactly where you stand.
*   **Bunk Calculator**: Know instantly how many classes you can skip ("bunk") while staying safe (e.g., above 75%).
*   **Mass Bunk**: Quickly mark multiple classes as bunked for those "planned sick days".
*   **Smart Alerts**: Get warnings when you're entering the "Danger Zone".

### 📅 Automatic Timetable Sync
*   **Seamless Integration**: Just select your Semester & Section, and your schedule is auto-populated.
*   **Today's View**: See your daily schedule at a glance on the dashboard.

### 📍 Chill Spots Discovery
*   **Crowdsourced Gems**: Find the best cafes, parks, and gaming zones near campus.
*   **Live Activity**: See where your friends are chilling right now (Friends Activity).
*   **Voting System**: Upvote the best spots and see what's trending.

### 👥 Social Features
*   **Profile Sync**: Link **Google** & **Discord** to sync your data across devices.
*   **Friends Activity**: Keep up with your squad's bunking status.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
*   **Backend**: Next.js API Routes, Node.js
*   **Database**: MongoDB (Mongoose)
*   **Auth**: NextAuth.js (Google & Discord)
*   **Styling**: CSS Modules & Vanilla CSS Variables

---

## ⚡ Getting Started

Follow these steps to run ChillPeriod locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Start-End-404/ChillPeriod.git
cd ChillPeriod/chillperiod-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the root directory and add your credentials:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start chilling! 😎

---

## 🤝 Contributing
Have an idea to make bunking even more efficient? PRs are welcome!
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ (and a few bunks) by [Tony](https://github.com/DarkModeTony)*
