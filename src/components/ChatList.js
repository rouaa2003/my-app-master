import React, { useState, useEffect } from "react";
import "./ChatList.css";

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchAllChats();
  }, []);

  const fetchAllChats = async () => {
    try {
      const response = await fetch(
        "http://www.product.somee.com/api/Chat/GetAllChat",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      setChats(data || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  return (
    <div className="chat-list">
      <h3>Your Chats</h3>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => onSelectChat(chat.userId)}
        >
          <img
            src={chat.userImage || "default-avatar.png"}
            alt={chat.userName}
          />
          <div>
            <h4>{chat.userName}</h4>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
