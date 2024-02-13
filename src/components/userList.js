import React, { useState, useEffect } from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, onUserClick, yourid , isopen ,toggleSidebar}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
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

  useEffect(() => {
    // Filter users based on search query
    const filtered = users.filter(
      (user) =>
        user.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobileNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
    <div className='d-none d-lg-block d-xl-none'>
      <button className={`btn btn-primary hamburger ${isopen ? 'is-active' : ''}`} onClick={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>
      </div>
      <div className={`offcanvas offcanvas-start ${isopen ? 'show' : ''}`} tabIndex="-1">
        <div className="offcanvas-header">
          <h3 className="offcanvas-title">I CHAT WITH YOU</h3>
          <button type="button" className="btn-close text-reset" onClick={toggleSidebar}></button>
        </div>

        <div className="offcanvas-body">
          {/* Search input */}
          <Form.Control
            type="text"
            placeholder="Search by ID or Mobile"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* User list */}
          <ListGroup>
            {filteredUsers.map((user) => (
              <ListGroup.Item
                key={user.uid}
                onClick={() => {
                  setSelectedUser(user);
                  onUserClick(user);
                  toggleSidebar(); // Close the sidebar on user click
                }}
                className={`list-group-item ${selectedUser === user ? 'active' : ''}`}
              >
                {user.uid === yourid ? `${user.nickname} (You)` : user.nickname}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <button className="btn btn-danger" onClick={handleLogout} style={{ marginBottom: '10px' }}>
          Logout
        </button>
      </div>

      <div className={`offcanvas-backdrop ${isopen ? 'show' : ''}`} onClick={toggleSidebar}></div>

      <style jsx>{`
        .offcanvas {
          position: fixed;
          top: 0;
          right: 0;
          width: 250px;
          height: 100%;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
        }

        .offcanvas.show {
          transform: translateX(0);
        }

        .offcanvas-backdrop {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease-in-out, visibility 0s linear 0.3s;
        }
      `}</style>
    </>
  );
};

export default UserList;
