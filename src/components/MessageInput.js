import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw';


const renderers = {
  link: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};
const Messaging = ({ userId, reciverId, selecteduser, isOpen, toggleSidebar, setUnreadCounts, isPageVisible, unreadCounts }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const [isRTyping, setIsRTyping] = useState(false);
  const [totalunread, setTotalunread] = useState(0);
  const [loading,setloading] = useState(false);


  useEffect(() => {
    // Scroll to the bottom when messages change
    // (Assuming you want to scroll when new messages arrive)
    if (messages.length > 0) {
      const messagesContainer = document.getElementById('messages-container');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, newMessage]);
  useEffect(() => {
    // Listen for changes in the online status of the receiver
    socket.on('userStatus', ({ userId, isOnline }) => {
      if (userId === reciverId) {
        setIsReceiverOnline(isOnline);
      }
    });

    const checkReceiverOnlineStatus = () => {
      // Emit an event to the server to check the online status of the receiver
      socket.emit('checkUserStatus', { userId: reciverId });
    };
    // Cleanup event listener on component unmount
    checkReceiverOnlineStatus();
    return () => {
      socket.off('userStatus');
    };

  }, [reciverId]);

  // Use this function to check the online status of the receiver

  useEffect(() => {
    console.log('Socket connected:', socket.connected);
    socket.emit('join', { userId, reciverId });
    setloading(true);
    socket.on('previousMessages', (data) => {
      setMessages(data.messages);
      setloading(false);
    });

    // Listen for 'newMessage' events from the socket
    socket.on('newMessage', (data) => {
      // Check if receiverId is not equal to data.senderId before adding the message
      if (reciverId === data.senderId || userId === data.senderId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: data.senderId, reciverId: data.reciverId, text: data.text, timestamp: new Date() },
        ]);
        // console.log(reciverId, data.senderId);
      } else {


        setUnreadCounts((prevUnreadCounts) => ({
          ...prevUnreadCounts,
          [data.senderId]: (prevUnreadCounts[data.senderId] || 0) + 1,
        }));

      }

    });
    setTotalunread(() => {
      const sum = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
      return sum;
    });



    // Clean up socket listeners when the component unmounts
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('newMessage');
      socket.off('userStatus');

    };
  }, [userId, reciverId, unreadCounts, setTotalunread, setUnreadCounts]);

  useEffect(() => {
    socket.emit('typing', { senderId: userId, receiverId: reciverId, isTyping: isRTyping });
    socket.on('typing', (data) => {
      // console.log(data, reciverId);
      if (reciverId === data.userId) {
        setIsRTyping(!data.isTyping);
        // Clear typing indicator after 5 seconds (adjust as needed)
        setTimeout(() => {
          setIsRTyping(false);
        }, 5000);
      }
    });
    return () => {
      socket.off('typing');
    }

  }, [newMessage, reciverId, userId])

  const handleSendMessage = async (e) => {
    try {
      if (reciverId) {
        // Emit a 'sendMessage' event to the server
        socket.emit('sendMessage', {
          senderId: userId,
          receiverId: reciverId,
          text: newMessage,
          username: userId.nickname,
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
  useEffect(() => {
    socket.emit("setoffline", ({ senderId: userId, offline: isPageVisible }))
  }, [isPageVisible, userId])

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
      // Firestore timestamp format
      const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      return {
        formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedDate: date.toLocaleDateString(),
      };
    } else {
      // Other timestamp format
      const date = new Date(timestamp);
      return {
        formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedDate: date.toLocaleDateString(),
      };
    }
  };
  const handleKeyDown = async (e) => {
    try {
      if (reciverId) {
        if (e.key === 'Enter' && !e.shiftKey && e.value?.length > 0) {
          // If Enter is pressed without the Shift key, append a newline character
          setNewMessage((prevMessage) => prevMessage + '\n');
        } else if (e.key === 'Enter' && e.shiftKey) {
          // If Enter is pressed with the Shift key, handle it as sending the message
          e.preventDefault();
          handleSendMessage();
        } else {
          // If any other key is pressed, update the newMessage state
          setNewMessage(e.target.value);
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
          // Perform paste action
          inputRef.current.focus();
          document.execCommand('paste');
        }
      } else {
        console.error('Receiver ID is undefined');
        setError('Receiver ID is undefined');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard:', text);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
      });
  };
  const inputRef = useRef(null);

  const handleLongPress = () => {
    // Perform paste action
    inputRef.current.focus();
    document.execCommand('paste');
  };

  const handleDoubleTap = () => {
    // Perform paste action
    inputRef.current.focus();
    document.execCommand('paste');
  };
  const insertLineBreaks = (text, interval) => {
    const regex = new RegExp(`.{1,${interval}}`, 'g');
    return text.match(regex)?.join('\n');
  };



  return (
    <>
      <div style={{ height: '100%' }} className='main-chat'>
        <div style={{ height: '1.5cm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="header">
          <div className="d-flex align-items-center">
            <div className='d-lg-none d-xl-block'>
              <button className={`btn position-relative ${isOpen ? 'is-active' : ''}`} onClick={toggleSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="bi bi-box-arrow-in-left color-purple z-5" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z" />
                  <path fillRule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                </svg>
                {totalunread > 0 &&
                  <div className='bg-color-1 color-2 position-absolute'
                    style={{
                      height: '0.8cm',
                      width: '0.8cm',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px',
                      marginTop: '2px',
                      marginLeft: '5px',
                      fontSize: '1.5rem',
                      top: "15px",
                      left: "20px",
                      zIndex: "0"

                    }}
                  >
                    {totalunread > 0 ? totalunread : ""}
                  </div>

                }

              </button>
            </div>
            <div className='bg-color-2 color-purple'
              style={{
                height: '1.3cm',
                width: '1.3cm',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                marginTop: '1px',
                marginLeft: '5px',
                fontSize: '1.5rem',
              }}
            >
              {selecteduser.nickname?.charAt(0)?.toUpperCase()}
            </div>
            <span> {reciverId === userId ? `${selecteduser.nickname}(You)` : selecteduser.nickname}</span>
          </div>
          <div key={userId} className={`online-status ${isRTyping ? 'text-primary bg-light rounded' : isReceiverOnline ? 'text-success bg-light rounded text-bold' : 'text-danger bg-light rounded'}`}>
            {isRTyping && reciverId !== userId ? 'Typing...' : (isReceiverOnline ? 'Online' : 'offline')}
          </div>
        </div>

        <div style={{ height: 'calc(100% - 3.5cm)' }} className="conversation" id='messages-container'>
          {error ? (
            <div className="alert alert-danger">Error: {error}</div>
          ) : (
            messages.map((message) => (

              <div className={message.senderId === userId ? 'text-right' : 'text-left'} key={message.id}>
                <div
                  key={message.id}
                  className={` d-flex  d-flex-inline  ${message.senderId === userId
                    ? ' flex-row-reverse '
                    : 'flex-row'
                    }`}


                >
                  <div
                    key={message.id}
                    className="mb-2 ps-1 pe-1 m-1 rounded position-relative"
                    style={{
                      minWidth: "3cm",
                      whiteSpace: "pre-wrap",
                      maxWidth: "75%",
                      ...(message.senderId === userId
                        ? { backgroundColor: "#BED1CF" }
                        : { backgroundColor: "#E78895" }),
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      copyToClipboard(message.text);
                      alert("message copied to clipboard")
                    }}
                  > <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={renderers}>{insertLineBreaks(message.text, 30)}</Markdown>

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '5px',
                      }}
                    >
                      <small style={{ fontSize: "9px" }} className='text-muted'>
                        {`${formatTimestamp(message.timestamp).formattedDate} ${formatTimestamp(message.timestamp).formattedTime}`}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ height: '2cm' }} className="message">
          <div className="d-flex justify-content-between align-items-center">
            <textarea
              maxLength={1000}
              style={{ height: '100%', resize: 'none', whiteSpace: "pre-wrap" }}  // Set a fixed height and disable resizing
              type="text"
              cols={31}
              ref={inputRef}
              className="form-control flex-grow-1 mr-2 send-message-input user-list"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
              onTouchStart={() => setTimeout(handleLongPress, 500)} // 500ms for long press
              onDoubleClick={handleDoubleTap}
            />
            <button className="button-send" type="submit" disabled={newMessage.length < 1} onClick={handleSendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send " viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messaging;
