# ChillPeriod 🎓

### The Ultimate Campus Life Assistant

ChillPeriod is your go-to companion for managing academic life without the stress. Track attendance, calculate safe bunks, sync your timetable, and discover the best chill spots near campus—all in one place.

![ChillPeriod Dashboard](https://via.placeholder.com/800x400.png?text=ChillPeriod+Dashboard+Preview)

## 🚀 Key Features

### 📚 SyllabusX Integration
*   **Real-time Syllabus**: Access the latest B.Tech syllabus directly from [SyllabusX](https://syllabusx.live).
*   **Progress Tracking**: Mark topics as completed with interactive checkboxes that persist across sessions.
*   **Unit-wise Breakdown**: View theory and lab subjects organized by units for structured study.
*   **Study Materials**: One-click access to notes, PYQs, and books for each subject.

### 📊 Attendance Tracker
*   **Per-Course Progress**: Visual bars show exactly where you stand.
*   **Safety Status**: Color-coded indicators (Green/Yellow/Red) showing if you are Safe, in Caution, or in the Danger Zone.
*   **Bunk Calculator**: Know instantly how many classes you can skip while maintaining 75%.
*   **Mass Bunk**: Mark multiple classes as bunked and **trigger a cascading alert** to your followers. If they join, the bunk wave continues!

### 📍 Chill Spots Discovery & Voting
*   **Crowdsourced Gems**: Find the best cafes, parks, and gaming zones near campus.
*   **Vote System**: Upvote (🔥) or Downvote (👎) spots to highlight the best places to chill.
*   **Live Activity**: See where your friends are chilling right now.
*   **Admin Controls**: Moderators can reset vote counts to keep the leaderboard fresh.

### 👥 Enhanced Social Profile
*   **Social Stats**: Track your Followers and Following user counts.
*   **Profile Sync**: Link **Google** & **Discord** to sync your data across devices.
*   **Friends Activity**: Keep up with your squad's bunking status and current location.
*   **Onboarding Flow**: Set your unique username and profile details seamlessly.

### 🔔 Smart Notifications
*   **Cascading Mass Bunk**: When a friend bunks, you get an invite. If you join, your followers get invited too!
*   **Bunk Alerts**: Get notified if a bunk will drop your attendance below the safe threshold.
*   **Class Reminders**: Never miss a lecture with timely notifications.
*   **Engagement**: Get alerts for new followers and profile interactions.

### �📅 Timetable Sync
*   **Automatic Population**: Select your Semester & Section to instantly load your schedule.
*   **Today's View**: See your daily schedule at a glance on the dashboard.

---

## � Project Structure

```bash
src/
├── app/              # Next.js App Router pages & API
│   ├── api/          # Backend API routes (Auth, Proxy, Users)
│   ├── syllabus/     # Syllabus page with proxy integration
│   └── ...
├── components/       # Reusable UI components
├── lib/              # Utilities, DB models, & validators
│   ├── data/         # Static data & API clients
│   └── models/       # Mongoose schemas
└── ...
```

---

## �🛠️ Tech Stack

*   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
*   **Backend**: Next.js API Routes, Node.js
*   **Database**: MongoDB (Mongoose)
*   **Auth**: NextAuth.js v5 (Google & Discord)
*   **Styling**: CSS Modules & Vanilla CSS Variables
*   **Deployment**: Vercel

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
