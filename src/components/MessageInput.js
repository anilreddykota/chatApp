import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

const Messaging = ({ userId, reciverId, selecteduser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
  

  useEffect(() => {

    console.log('Socket connected:', socket.connected);

    // Join the chat room when the component mounts
    socket.emit('join', {userId,reciverId});
    socket.on('previousMessages', (data) => {
      setMessages(data.messages);
    
    });

    // Listen for 'newMessage' events from the socket
    socket.on('newMessage', (data) => {
   
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: data.senderId, reciverId: data.reciverId, text: data.text, timestamp: new Date() },
        ]);

    });
  

    // Clean up socket listeners when the component unmounts
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('newMessage');
    };
  }, [userId,reciverId]);

  const handleSendMessage = async () => {
    try {
      if (reciverId) {
        // Emit a 'sendMessage' event to the server
        socket.emit('sendMessage', {
          senderId: userId,
          receiverId: reciverId,
          text: newMessage,
        });

        setNewMessage('');
      } else {
        console.error('Receiver ID is undefined');
        setError('Receiver ID is undefined');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
    }
  };
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
      // Firestore timestamp format
      const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Other timestamp format
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  return (
    <> <div className="d-flex flex-column h-50" style={{ maxHeight: '75vh' }}>
    <div className="bg-light position-fixed w-100 " style={{zIndex:"999"}}>
      <div className="d-flex align-items-center">
        <div
          style={{
            height: '1.3cm',
            width: '1.3cm',
            backgroundColor: '#00b7ff', // You can customize the background color
            color: '#cd295a', // Text color
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            fontSize: '1.5rem',
          }}
        >
          {selecteduser.nickname.charAt(0).toUpperCase()}
        </div>
        <span>Chatting with: {selecteduser.nickname}</span>
      </div>
    </div>
    <div
      className="flex-grow-1 overflow-auto p-3"
      style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        maxHeight: '85vh',
        overflow: 'scroll',
        minHeight: '80vh',
        marginTop: '1.5cm', // Adjusted margin to accommodate top bar
      }}
      ref={messagesContainerRef}
    ><div >

   
      {error ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`my-2 p-3 rounded ${
              message.senderId === userId
                ? 'bg-primary text-white float-right'
                : 'bg-light text-left border border-secondary float-left'
            }`}
            style={{
              maxWidth: 'fit-content',
              position: 'relative', // Add relative positioning to the message container
            }}
            ref={messagesContainerRef}
          >
            <div className="mb-2" style={{minWidth:"1.5cm"}}>
             <b> {message.text}</b>
            </div>
            <div
              className={"text-right"}
              style={{
                position: 'absolute', // Add absolute positioning to the timestamp
                bottom: '0',
                right: '0',
              }}
            >
              <small>{formatTimestamp(message.timestamp)}</small>
            </div>
          </div>
        ))
      )} </div>
     
      
    </div>
  </div>

  <div className="bg-light p-3 position-fixed w-100 fixed-bottom">
 
    <div className="d-flex justify-content-between align-items-center">
      <input
        type="text"
        className="form-control flex-grow-1 mr-2"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={newMessage.length < 1}
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>

</div>

</>
  );
};

export default Messaging;
