import webpush from 'web-push';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

// Configure web-push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

let isConfigured = false;
if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:contact@chillperiod.com',
    vapidPublicKey,
    vapidPrivateKey
  );
  isConfigured = true;
} else {
  console.warn('VAPID keys are missing. Web Push will not work.');
}

/**
 * Sends a push notification to all stored subscriptions of a specific user.
 * 
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @param {Object} payload - The notification payload.
 * @param {string} payload.title - The title of the notification.
 * @param {string} payload.body - The message body.
 * @param {string} [payload.url] - The URL to open when the notification is clicked.
 * @param {string} [payload.icon] - The icon to display.
 */
export async function sendNotificationToUser(userId, payload) {
  if (!isConfigured) return;

  try {
    await dbConnect();
    const user = await User.findById(userId).select('pushSubscriptions notificationsEnabled');
    
    if (!user || user.notificationsEnabled === false || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
      return; 
    }

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/android-chrome-192x192.png',
      url: payload.url || '/attendance',
      sound: '/class-notifi.wav',
    });

    const failedSubscriptions = [];

    // Send notifications concurrently
    await Promise.allSettled(
      user.pushSubscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payloadString);
        } catch (error) {
          console.error('[Web Push Error]', error);
          if (error.statusCode === 404 || error.statusCode === 410) {
            // Subscription has expired or is no longer valid
            failedSubscriptions.push(subscription.endpoint);
          }
        }
      })
    );

    // Clean up invalid subscriptions
    if (failedSubscriptions.length > 0) {
      await User.findByIdAndUpdate(userId, {
        $pull: { pushSubscriptions: { endpoint: { $in: failedSubscriptions } } }
      });
    }

  } catch (error) {
    console.error('[Web Push System Error]', error);
  }
}
