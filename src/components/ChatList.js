import React, { useState, useEffect } from "react";


function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllChats();
  }, []);

  const fetchAllChats = async () => {
    const token = localStorage.getItem("authToken"); // استخدام المفتاح الصحيح

    if (!token) {
      setError("No token found. Please login.");
      return;
    }

    try {
      const response = await fetch("http://www.product.somee.com/api/Chat/GetAllChat", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const result = await response.json();

      if (result.errorMessage) {
        setError(result.errorMessage);
        setChats([]); // Clear chats if there's an error
      } else {
        setChats(result.data || []); // Handle case where data might be null
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("An error occurred while fetching chats.");
    }
  };

  if (error) {
    return <div className="chat-list-error">{error}</div>;
  }

  return (
    <div className="chat-list">
      <h3>Your Chats</h3>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => onSelectChat(chat.userId)}
          >
            <div>
              <h4>{chat.userName}</h4>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <div>No chats available</div>
      )}
    </div>
  );
}

export default ChatList;
