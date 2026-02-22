'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { TIMETABLE_DATA, getSchedule } from '@/lib/data/timetable';
import { playNotificationSound } from '@/lib/notification-sound';

// Hardcoded public key to perfectly guarantee it is available on the client side without Next.js env bugs
const vapidPublicKey = "BLDPhz7dgPNdOJHFIswQNjD2RhLt3lQ5U2HpUlVle14EZ3mR3w4RFkzvOLOVmyaGlUJmsEtgl4xxZrz1gI40QDI";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const { data: session } = useSession();
  const lastUnreadCount = useRef(0);

  useEffect(() => {
    // 1. Web Push Subscription Setup
    const setupWebPush = async () => {
      if (!session?.user?.id || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
      if (Notification.permission === 'denied') return;

      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        // Wait for SW to be ready
        await navigator.serviceWorker.ready;

        // If permission isn't granted yet, request it
        if (Notification.permission === 'default') {
           const permission = await Notification.requestPermission();
           if (permission !== 'granted') return;
        }

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription && vapidPublicKey) {
           console.log('Attempting to subscribe to Web Push...');
           const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
           
           try {
             subscription = await registration.pushManager.subscribe({
               userVisibleOnly: true,
               applicationServerKey: applicationServerKey
             });
             console.log('Push subscription successful:', subscription);
           } catch (subErr) {
             console.error('Failed to subscribe PushManager (this is common in local/dev without HTTPS or due to browser blocks):', subErr);
             return;
           }

           // Send subscription to backend
           const backendRes = await fetch('/api/notifications/subscribe', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(subscription)
           });
           
           if (!backendRes.ok) {
               console.error('Failed to save push subscription to backend');
           }
        }
      } catch (e) {
        console.error('Web Push setup failed (Service Worker Error):', e);
      }
    };

    setupWebPush();
    // Poll for new in-app notifications and play sound (called initially and via SSE)
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch('/api/notifications?unread=true');
        if (res.ok) {
          const data = await res.json();
          if (data.unreadCount > lastUnreadCount.current && lastUnreadCount.current !== 0) {
            // New notification arrived — play sound
            playNotificationSound();
          }
          lastUnreadCount.current = data.unreadCount;
        }
      } catch (e) {
        // Silently ignore polling errors
      }
    };

    // Initial fetch
    fetchNotifications();

    // Setup Server-Sent Events (SSE) for instant real-time updates
    const eventSource = new EventSource('/api/notifications/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.newNotification) {
           fetchNotifications();
           // Optionally dispatch a custom event if other components (like Navbar badge) need updating instantly
           window.dispatchEvent(new Event('new_notification'));
        }
      } catch (err) {}
    };

    eventSource.onerror = () => {
      // Reconnect handled automatically by browser EventSource
    };

    // Class schedule notifications
    const checkSchedule = async () => {
      if (!session?.user?.id) return;
      if (typeof Notification === 'undefined') return;
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
          if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(key)) {
            // Play chime sound
            playNotificationSound();
            
            // Send browser Notification
            new Notification(`Class Alert: ${classSlot.subject || 'Lab'}`, {
              body: `Starts in 5 minutes! Room: ${sectionData.room || 'N/A'}\n${timeSlot.time}`,
              icon: '/icon.png'
            });
            
            sessionStorage.setItem(key, 'true');
          }
        }
      });
    };

    // Check every minute
    const scheduleInterval = setInterval(checkSchedule, 60000);
    
    // Initial check
    checkSchedule();

    return () => {
      eventSource.close();
      clearInterval(scheduleInterval);
    };
  }, [session]);

  return null; // Headless component
}
