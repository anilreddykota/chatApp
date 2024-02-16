// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBe9u3_pBODk-oeva-GxjdaQECHDr0alhI",
  authDomain: "chatappsocketanil.firebaseapp.com",
  projectId: "chatappsocketanil",
  storageBucket: "chatappsocketanil.appspot.com",
  messagingSenderId: "736990892314",
  appId: "1:736990892314:web:69a2b151351cf72ace9ca3",
  measurementId: "G-BP39KRDGXC"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, message,from } = payload.data; // Assuming you send custom data from the server

  // Customize notification options
  const notificationOptions = {
    body: message || 'new message received',
    icon: 'https://ichatwithyou.vercel.app/logo512.png', // URL to the notification icon
    // image: imageUrl || 'https://example.com/default-image.jpg', // URL to an image displayed in the notification
    badge: 'https://ichatwith.vercel.app/logo512.png', // URL to a badge to be displayed on the notification
    vibrate: [200, 100, 200], // Vibration pattern
    data: { click_action: 'FLUTTER_NOTIFICATION_CLICK' }, // Additional data sent with the notification
    actions: [
      { action: 'https://ichatwithyou.vercel.app', title: 'Open', icon: 'https://ichatwithyou.vercel.app/logo512.png' },
    ],
  };

  // Show the notification
  self.registration.showNotification(title || 'New Message Received In I C W Y', notificationOptions);
});


