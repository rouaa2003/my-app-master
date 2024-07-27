import React, { useState } from 'react';
import './ChatContainer.css';

function ChatContainer({ isOpen }) {
  const [activeChat, setActiveChat] = useState(null);

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
  };

  const handleExitChat = () => {
    setActiveChat(null);
  };

  return (
    <div id="chat-container" className={`chat-container ${isOpen ? 'open' : ''}`}>
      <div className="chat-list" id="chat-list" style={{ display: activeChat ? 'none' : 'block' }}>
        <h2>Chats</h2>
        <div className="chat-item" data-chat-id="chat1" onClick={() => handleChatClick('chat1')}>Chat 1</div>
        <div className="chat-item" data-chat-id="chat2" onClick={() => handleChatClick('chat2')}>Chat 2</div>
        <div className="chat-item" data-chat-id="chat3" onClick={() => handleChatClick('chat3')}>Chat 3</div>
      </div>
      {activeChat && (
        <div id="chat-content" className={`chat-content ${activeChat ? 'active' : ''}`}>
          <button className="exit-chat-button" onClick={handleExitChat}>&times;</button>
          <h2>Chat Details</h2>
          <div className="messages">
            <p>Messages for {activeChat}</p>
          </div>
          <div className="new-message">
            <input type="text" placeholder="Type your message..." />
            <button>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
