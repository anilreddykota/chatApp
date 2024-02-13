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
      messagesContainerRef.current.scrollBottom = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {

    console.log('Socket connected:', socket.connected);

    // Join the chat room when the component mounts
    socket.emit('join', { userId, reciverId });
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
  }, [userId, reciverId]);

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
    <> <div className="d-flex flex-column h-100" style={{ maxHeight: '73vh' }}>
      <div className="bg-light position-fixed w-100 " style={{ zIndex: "999" }}>
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
              <div className={message.senderId === userId ? 'text-right' : 'text-left'}>
                <div
                  key={message.id}
                  className={`p-0 m-2 rounded ${message.senderId === userId
                    ? 'bg-primary text-white '
                    : 'bg-light  border border-secondary '
                    }`}
                  style={{
                    maxWidth: 'fit-content',
                    // Add relative positioning to the message container
                  }}
                  ref={messagesContainerRef}
                >
                  <div className="mb-2 p-0 ml-auto p-2 " style={{ minWidth: "2cm" }}>
                    <b> {message.text}</b>
                  </div>
                  <div
                    className={"text-right "}
                    style={{
                      position: 'relative', // Add absolute positioning to the timestamp
                      bottom: '5px',
                      left: '50%',
                    }}
                  >
                    <small style={{ fontSize: "10px" }}>{formatTimestamp(message.timestamp)}</small>
                  </div>
                </div>
              </div>
            ))
          )} </div>


      </div>
    </div>

      <div className="bg-none p-3  w-100 fixed-bottom">

        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-control flex-grow-1 mr-2"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button className="button-send" type="submit"
            disabled={newMessage.length < 1}
            onClick={handleSendMessage}>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send " viewBox="0 0 16 16">
  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
</svg>          </button>

        </div>

      </div>

    </>
  );
};

export default Messaging;
