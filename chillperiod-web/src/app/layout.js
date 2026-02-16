import "./globals.css";
import { Inter, Outfit } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import NotificationManager from '@/components/NotificationManager';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: "ChillPeriod - Find Your Chill Spot & Track Attendance",
  description: "Discover the best chill spots near your college and track your attendance like a pro. Detailed attendance tracker for students.",
  keywords: ["chill spots", "attendance tracker", "college", "bunk", "students"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen font-sans">
              <NotificationManager />
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
