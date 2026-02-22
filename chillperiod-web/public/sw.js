self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      // Fallback if not JSON
      data = { title: 'ChillPeriod Alert', body: event.data.text() };
    }

    const title = data.title || 'ChillPeriod Update';
    const soundUrl = data.sound || '/class-notifi.wav';
    
    const options = {
      body: data.body || 'You have a new notification.',
      icon: data.icon || '/icon-192x192.png',
      badge: '/badge-72x72.png',
      sound: soundUrl, // Native Android support
      vibrate: [200, 100, 200, 100, 200],
      data: {
        url: data.url || '/',
      },
    };

    event.waitUntil(
        self.registration.showNotification(title, options).then(() => {
             // Fallback to play sound if native 'sound' prop is ignored by the OS 
             // (Some browsers allow Audio in SW if user has interacted, though it is restricted)
             try {
                const audio = new Audio(soundUrl);
                audio.play().catch(err => console.log('SW Audio play restricted:', err));
             } catch (e) {}
        })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
