# ChillPeriod 🧊📚

**The Ultimate Attendance Manager & Bunk Planner.**

ChillPeriod isn't just an attendance tracker; it's a lifestyle manager. It helps you calculate exactly how many classes you *must* attend to meet your college's criteria (75%) and how many you can safely *bunk* (skip) without getting into trouble.

When you do decide to bunk, ChillPeriod suggests the best "Chill Spots" near campus and lets you coordinate with friends.

---

## 🚀 Key Features

### 📚 SyllabusX Integration (NEW)
*   **Real-time Syllabus**: Access the latest B.Tech syllabus directly from [SyllabusX](https://syllabusx.live).
*   **Progress Tracking**: Mark topics as completed with interactive checkboxes.
*   **Resources**: Get direct links to notes, PYQs, and books.

### 📊 Smart Attendance & Bunking
*   **Safe-to-Bunk Calculator**: Know instantly if you're in the "Safe Zone" 🟢, "Caution Zone" 🟡, or "Danger Zone" 🔴.
*   **Mass Bunk Mode**: Coordinate mass bunks with your class group.
*   **Visual Analytics**: Charts showing attendance trends and subject-wise breakdown.

### 📍 Chill Spots & Voting (NEW)
*   **Discover Spots**: Find the best cafes, parks, and gaming zones.
*   **Vote System**: Upvote 🔥 or Downvote 👎 spots to help others find the best vibes.
*   **Friends Activity**: See where your friends are chilling in real-time.

### 👥 Social & Profile (NEW)
*   **Connect**: Follow friends and track their bunking status.
*   **Profile Sync**: Link **Google** & **Discord** accounts for seamless data access.
*   **Onboarding Flow**: Seamless profile setup with **Terms & Conditions** acceptance.
*   **Manage Account**: Full control over your data with **Delete Account** options.

### 📅 Timetable Sync
*   **Auto-Sync**: Select your Semester & Section to instantly load your official schedule.

### 🛡️ Privacy & Security (NEW)
*   **Terms & Conditions**: Mandatory acceptance to ensure a safe community.
*   **Data Control**: Full ownership of your data with immediate deletion options.
*   **Privacy First**: Minimal data collection, focused only on essential academic features.

### ⚡ Performance
*   **Optimized Assets**: Next.js Image Optimization for lightning-fast load times.
*   **Dynamic Loading**: Smart code-splitting for a responsive experience on any device.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with Mongoose
*   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Validation**: Zod & React Hook Form

---

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   MongoDB Atlas Account

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Start-End-404/ChillPeriod.git
    cd ChillPeriod/chillperiod-web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the `chillperiod-web` directory:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_random_secret_string

    # OAuth Providers
    GOOGLE_CLIENT_ID=your_google_id
    GOOGLE_CLIENT_SECRET=your_google_secret
    DISCORD_CLIENT_ID=your_discord_id
    DISCORD_CLIENT_SECRET=your_discord_secret
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

We welcome contributions!
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
