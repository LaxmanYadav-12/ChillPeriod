'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TIMETABLE_DATA, getSchedule } from '@/lib/data/timetable';

export default function NotificationManager() {
  const { data: session } = useSession();

  useEffect(() => {
    // Check permission immediately
    if (Notification.permission === 'default') {
      // Logic handled in Profile toggle, but good to know
    }

    const checkSchedule = async () => {
      if (!session?.user?.id) return;
      if (Notification.permission !== 'granted') return;

      // Fetch fresh user data to get latest semester/section
      let semester = session.user.semester;
      let section = session.user.section;

      try {
        const res = await fetch(`/api/users/${session.user.id}?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const userData = await res.json();
          semester = userData.semester;
          section = userData.section;
        }
      } catch (e) {
        console.error('NotificationManager: Failed to fetch user data', e);
      }

      if (!semester || !section) return;

      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes from midnight

      // Get schedule
      const sectionData = getSchedule(parseInt(semester), section);
      if (!sectionData || !sectionData.schedule[dayName]) return;

      // Check each slot
      sectionData.schedule[dayName].forEach(classSlot => {
        if (classSlot.type === 'BREAK') return;

        // Find time string
        const timeSlot = TIMETABLE_DATA.time_slots.find(ts => ts.slot === classSlot.slot);
        if (!timeSlot) return;

        // Parse start time "09:30" -> 570
        const [startStr] = timeSlot.time.split('-');
        const [h, m] = startStr.split(':').map(Number);
        const startTime = h * 60 + m;

        const diff = startTime - currentTime;

        // Notify if exactly 5 minutes left (or within a small window to avoid missing it)
        if (diff === 5) {
          const key = `notified_${dayName}_${classSlot.slot}_${now.toDateString()}`;
          if (!sessionStorage.getItem(key)) {
            // Send Notification
            new Notification(`Class Alert: ${classSlot.subject || 'Lab'}`, {
              body: `Starts in 5 minutes! Room: ${sectionData.room || 'N/A'}\n${timeSlot.time}`,
              icon: '/icon.png' // Optional
            });
            
            sessionStorage.setItem(key, 'true');
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkSchedule, 60000);
    
    // Initial check
    checkSchedule();

    return () => clearInterval(interval);
  }, [session]);

  return null; // Headless component
}
