import { useEffect } from 'react';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

const PushNotification = ({ userId }) => {
    useEffect(() => {
        const requestNotificationPermission = async () => {
          try {
            var token;
            // Request notification permission
            const permission = await Notification.requestPermission();
      
            // If permission is granted and FCM token is not already in local storage
            if (permission === 'granted' && !localStorage.fcn_token) {
              // Request FCM token
              token = await getToken(messaging, { vapidKey: "BCT6pfs-p0GpE3zJRGddn3EHEAdz79x5_54T2ImM4ZBi2w6MN2lvPARhi9g0LRvWucDdYz8ABnuO8MDqBWoqOAA" });
      
              // Save FCM token to local storage
              localStorage.setItem("fcn_token", token);
            }
      
            // Get FCM token from local storage or the newly obtained token
            const fcmToken = localStorage.fcn_token || token;
            
            // Send FCM token to the server
            sendTokenToServer(fcmToken, userId);
          } catch (error) {
            console.error('Error getting permission or token:', error);
          }
        };
      
        // Invoke the requestNotificationPermission function when userId changes
        requestNotificationPermission();
      }, [userId]);
      
  

  const sendTokenToServer = (token, userId) => {
    const serverApiUrl = 'https://chatappserver-zop9.onrender.com/api/save-fcm-token';

    fetch(serverApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send FCM token to server');
        }
        console.log('FCM token sent to server successfully');
      })
      .catch((error) => {
        console.error('Error sending FCM token to server:', error.message);
      });
  };

  return null; // Adjust the return value based on your component's requirements
};

export default PushNotification;
