import "./globals.css";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "ChillPeriod - Find Your Chill Spot & Track Attendance",
  description: "Discover the best chill spots near your college and track your attendance like a pro. BunkMate-inspired attendance tracker for students.",
  keywords: ["chill spots", "attendance tracker", "college", "bunk", "students"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
