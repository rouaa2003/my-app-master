import React, { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "../api/fetchWithAuth";

import "./ChatWindow.css";

function ChatWindow({ sellerId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetchChatHistory();
  }, [sellerId]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetchWithAuth(
        `http://www.product.somee.com/api/Chat/GetChatWithUser?userId=${sellerId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", newMessage);
      formData.append("receiverId", sellerId.toString());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetchWithAuth(
        "http://www.product.somee.com/api/Chat/SendMessage",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Add the sent message to the local state
      setMessages([
        ...messages,
        {
          text: newMessage,
          sender: "user",
          file: selectedFile ? URL.createObjectURL(selectedFile) : null,
        },
      ]);
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat with Seller</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow;
