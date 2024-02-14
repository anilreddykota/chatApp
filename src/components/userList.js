import React, { useState, useEffect } from 'react';
import { ListGroup, Form, Col, Row} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, onUserClick, yourid, isopen, toggleSidebar, setUnreadCounts, unreadCounts }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

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
  const handleSort = () => {
    // Toggle sort order between 'asc' and 'desc'
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    // Perform sorting logic
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.nickname?.toUpperCase();
      const nameB = b.nickname?.toUpperCase();
      if (sortOrder === 'asc') {
        return nameA?.localeCompare(nameB);
      } else {
        return nameB?.localeCompare(nameA);
      }
    });
    setFilteredUsers(sortedUsers);
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleUserClick = (selectedUserId) => {
    // Reset unread count for the selected user
    setUnreadCounts((prevUnreadCounts) => ({
      ...prevUnreadCounts,
      [selectedUserId.uid]: 0,
    }));
    setSelectedUser(selectedUserId);
    onUserClick(selectedUserId);
    toggleSidebar();
    // Add logic to open the chat with the selected user
    // ...
  };

  return (
    <>
      <div className='d-none d-lg-block d-xl-none'>
        <button className={`btn btn-primary hamburger ${isopen ? 'is-active' : ''}`} onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
          </svg>
        </button>
      </div>
      <div className={`offcanvas offcanvas-start ${isopen ? 'show' : ''}`} tabIndex="-1">
        <div className="offcanvas-header">
          <h3 className="offcanvas-title">I CHAT WITH YOU</h3>
          <button type="button" className="btn-close text-reset" onClick={toggleSidebar}></button>
        </div>
        <div className="container-fluid">
          <Row>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Search by ID or Mobile"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Col>
            <Col sm={3}>
              <button  onClick={handleSort} className='btn bg-purple'>
                <div id="stroke1"></div>
                <div id="stroke2"></div>
                <div id="stroke3"></div>
              </button>
            </Col>
          </Row>

        </div>

        <div className="offcanvas-body userlist" >
          {/* Search input */}


          {/* User list */}
          <ListGroup >
            {filteredUsers.map((user) => (
             <ListGroup.Item
             key={user.uid}
             onClick={() => handleUserClick(user)}
             className={`list-group-item d-flex justify-content-between align-items-center ${selectedUser === user ? 'list-group-item-danger' : ''}`}
           >
             <div>
               {user.uid === yourid ? `${user.nickname} (You)` : user.nickname}
             </div>
             {unreadCounts[user.uid] > 0 &&  user.uid !== yourid &&  (
               <div className="bg-color-2 color-purple"
        
               style={{
                height: '0.6cm',
                width: '0.6cm',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                marginTop: '2px',
                marginLeft: '5px',
                fontSize: '1rem',

              }}>
                 {unreadCounts[user.uid] === 1
                   ? '1'
                   : `${unreadCounts[user.uid]} `}
               </div>
             )}
           </ListGroup.Item>
           
            ))}

          </ListGroup>
        </div>

        <button className="button-logout" onClick={handleLogout} style={{ marginBottom: '10px' }}>
          Logout
        </button>
      </div>

      <div className={`offcanvas-backdrop ${isopen ? 'show' : ''}`} onClick={toggleSidebar}></div>

      <style jsx='true'>{`
        .offcanvas {
          position: fixed;
          top: 0;
          right: 0;
          width: 250px;
          height: 100%;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          transition-delay: .3s;
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
