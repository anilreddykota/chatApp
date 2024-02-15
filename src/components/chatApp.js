// src/components/ChatApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Row, Col } from 'react-bootstrap';
import Messaging from './MessageInput';
import UserList from './userList';
import PushNotification from '../PushNotification';

const ChatApp = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount



  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://chatappserver-zop9.onrender.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };
  return (
    <div className='m-3'>
      <PushNotification userId={currentUserId}/>
      <Row>
        <Col md={2}>
          <UserList users={users} onUserClick={handleUserClick} yourid={currentUserId} isopen={isOpen} toggleSidebar={toggleSidebar} unreadCounts={unreadCounts} setUnreadCounts={setUnreadCounts}/>
        </Col>
        <Col md={10} style={{ maxHeight: '94vh', overflowY: 'auto' }}>
          {selectedUser && (
            <Messaging userId={currentUserId} reciverId={selectedUser.uid} selecteduser={selectedUser} toggleSidebar={toggleSidebar}  isOpen={isOpen}  setUnreadCounts={setUnreadCounts} isPageVisible={isPageVisible}/>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ChatApp;
