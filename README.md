# ChillPeriod 🧊📚

**The Ultimate Attendance Manager & Bunk Planner for Students.**

ChillPeriod isn't just an attendance tracker; it's a lifestyle manager. It helps you calculate exactly how many classes you *must* attend to meet your college's criteria (75%) and how many you can safely *bunk* (skip) without getting into trouble.

When you do decide to bunk, ChillPeriod suggests the best "Chill Spots" near campus and lets you coordinate mass bunks with friends.

---

## 🚀 Key Features

### 📊 Smart Attendance Tracking
- **Safe-to-Bunk Calculator**: Know instantly if you're in the "Safe Zone" (Green), "Caution Zone" (Yellow), or "Danger Zone" (Red).
- **Subject Management**: Add all your courses and track attendance individually.
- **Visual Analytics**: Beautiful charts showing your attendance trends and monthly breakdowns.

### 😴 Strategic Bunking
- **Mass Bunk Coordination**: Plan skips with your entire class group.
- **Chill Spots**: Discover and upvote the best hangout spots near campus (cafes, parks, malls) with real-time "vibe" checks.

### 🤝 Social & Leaderboard
- **Friend Activity**: See what your friends are up to (attending or chilling).
- **Pro Bunkers Leaderboard**: Compete for titles like "Bunk King" or "Serial Skipper" based on your *calculated* risks.

### 🔐 Secure & Private
- **Authentication**: Sign in securely with **Google** or **Discord**.
- **Privacy Controls**: Choose to keep your profile public or private.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with Mongoose
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/)

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/chillperiod.git
    cd chillperiod-web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_random_secret_string

    # OAuth Providers
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_secret
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

### *Remember: Attend responsibly. Bunk strategically.* 😉
