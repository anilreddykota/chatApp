// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, onUserClick, yourid }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
    nav('/login');
  };

  useEffect(() => {
    // Set the first user as the default selected user
    if (users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  return (
    <div style={{ borderRight: '1px solid #ccc', padding: '10px', marginRight: '10px' ,maxHeight:"50%"}}>
      <h3>User List <button className='btn btn-danger' onClick={handleLogout}>Logout</button></h3>

      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item
            key={user.uid}
            onClick={() => {
              setSelectedUser(user);
              onUserClick(user);
            }}
            style={{ cursor: 'pointer', backgroundColor: selectedUser === user ? '#007BFF' : 'transparent', color: selectedUser === user ? '#FFF' : '#000' }}
          >
            {user.uid === yourid ? `${user.nickname} (You)` : user.nickname}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default UserList;
