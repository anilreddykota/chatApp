// src/components/ChatApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Row, Col } from 'react-bootstrap';
import Messaging from './MessageInput';
import UserList from './userList';

const ChatApp = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7001/users');
        console.log(response.data);
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
console.log(currentUserId,selectedUser); 
  return (
    <div className='m-3'>
      <Row>
        <Col md={3}>
          <UserList users={users} onUserClick={handleUserClick} yourid={currentUserId} />
        </Col>
        <Col md={9} style={{ maxHeight: '93vh', overflowY: 'auto' }}>
          {selectedUser && (
            <Messaging userId={currentUserId} reciverId={selectedUser.uid} selecteduser={selectedUser} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ChatApp;
