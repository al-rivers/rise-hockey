const CACHE = 'rise-hockey-v29';

const STATIC = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

// ─── NOTIFICATION CONTENT ───
const MORNING_MESSAGES = [
  { title: '🏒 Rise & Compete, Aleks', body: 'Every elite D-man at Michigan started their day intentional. Check in and own today.' },
  { title: '⚡ 7am. Aleks. Go.', body: 'Gap control starts with how you show up before the puck drops. Check in.' },
  { title: '🏒 Good morning, Aleks', body: 'January 2012. Best birthday in your draft year. Make it count today.' },
  { title: '💪 Rise Hockey — Morning Fuel', body: 'Gretzky said it: great players play where the puck is going. Where are you going today?' },
  { title: '🎯 Day starts now, Aleks', body: 'The work you put in this morning is what September tryouts are built on. Check in.' },
  { title: '🏒 Coach Al says: go', body: 'D-men who make U15A do not wait to feel motivated. They check in and build it.' },
  { title: '⚡ Morning, Aleks', body: 'Consistent players get consistent results. One check-in. One day. Build.' },
  { title: '🔥 Rise Hockey — Good Morning', body: 'Your gap control, your board battles, your future — built one morning at a time.' },
  { title: '🏒 Up and at it, Aleks', body: 'The best defencemen think before the play starts. Start your day with intention.' },
  { title: '💪 Michigan starts here', body: 'Every future D1 player has a morning routine. Check in and protect yours.' },
];

const WEIGH_IN_MESSAGE = {
  title: '⚖️ Monday Weigh-In, Aleks',
  body: 'Before you eat or drink anything — jump on the scale. Log your weight. Track the trend to September.'
};

// ─── INSTALL ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ───
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => caches.open(CACHE))
      .then(cache => cache.addAll(STATIC))
      .then(() => self.clients.claim())
  );
});

// ─── FETCH ───
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            caches.open(CACHE).then(c => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          if (response && response.ok) caches.open(CACHE).then(c => c.put(event.request, response.clone()));
          return response;
        })
      )
      .catch(() => new Response('Offline', { status: 503 }))
  );
});

// ─── MESSAGES FROM APP ───
self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'SCHEDULE_NOTIFICATIONS') scheduleAlarmCheck();
});

// ─── NOTIFICATION CLICK → open app ───
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        const existing = clients.find(c => c.url.includes(self.location.origin));
        if (existing) return existing.focus();
        return self.clients.openWindow('./');
      })
  );
});

// ─── ALARM LOOP ───
// Checks every 60s; fires at exactly 7:00 AM and 7:01 AM Monday.
// App re-registers on every open as backup.
let alarmInterval = null;

function scheduleAlarmCheck() {
  if (alarmInterval) clearInterval(alarmInterval);
  checkAndFireNotifications();
  alarmInterval = setInterval(checkAndFireNotifications, 60 * 1000);
}

function checkAndFireNotifications() {
  const now  = new Date();
  const hour = now.getHours();
  const min  = now.getMinutes();
  const day  = now.getDay(); // 0=Sun, 1=Mon

  if (hour === 7 && min === 0) fireMotivationalNotification();
  if (day === 1 && hour === 7 && min === 1) fireWeighInNotification();
}

function fireMotivationalNotification() {
  const doy = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const msg = MORNING_MESSAGES[doy % MORNING_MESSAGES.length];
  self.registration.showNotification(msg.title, {
    body: msg.body,
    icon: './icon-192.png',
    badge: './favicon-32.png',
    tag: 'rise-morning',
    renotify: false,
    requireInteraction: false,
    data: { url: './' }
  }).catch(() => {});
}

function fireWeighInNotification() {
  self.registration.showNotification(WEIGH_IN_MESSAGE.title, {
    body: WEIGH_IN_MESSAGE.body,
    icon: './icon-192.png',
    badge: './favicon-32.png',
    tag: 'rise-weighin',
    renotify: true,
    requireInteraction: true,
    data: { url: './' }
  }).catch(() => {});
}

// Kick off alarm loop immediately on SW activation
scheduleAlarmCheck();
