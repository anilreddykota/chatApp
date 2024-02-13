import React, { useState, useEffect } from 'react';
import OfflinePage from './oflinepage';

const InternetStatusChecker = ({online}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      window.location.reload();
    };

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <div>
      {isOnline ? online: <OfflinePage />}
    </div>
  );
};

export default InternetStatusChecker;
