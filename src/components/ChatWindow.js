import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import "./ChatWindow.css";

function ChatWindow({ sellerId, onClose, sellerName }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();
  const token = localStorage.getItem("authToken");

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `http://www.product.somee.com/api/Chat/GetChatWithUser?userId=${sellerId}`,

        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      console.log("Fetched chat data:", data);

      if (data && Array.isArray(data.data)) {
        setMessages((prevMessages) => {
          const newMessages = data.data.filter(
            (newMsg) =>
              !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id)
          );

          if (newMessages.length > 0) setHasNewMessage(true);

          return [...prevMessages, ...newMessages].sort(
            (a, b) => new Date(a.sendDate) - new Date(b.sendDate)
          );
        });
      } else {
        console.error("Unexpected data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchChatHistory();
    const intervalId = setInterval(fetchChatHistory, 5000);
    return () => clearInterval(intervalId);
  }, [fetchChatHistory]);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const sendFormData = new FormData();
      sendFormData.append("text", formData.message);
      sendFormData.append("receiverId", sellerId.toString());

      if (formData.file && formData.file[0]) {
        sendFormData.append("file", formData.file[0]);
      }

      const response = await fetch(
        `http://www.product.somee.com/api/Chat/SendMessage`,
        {
          method: "POST",
          body: sendFormData,

          headers: {
            Authorization: token,
          },
        }
      );

      const responseText = await response.text();
      console.log("Send message response:", responseText);

      const newMessageId = parseInt(responseText, 10);

      if (!isNaN(newMessageId)) {
        const newMessage = {
          id: newMessageId,
          text: formData.message,
          isSendByMe: true,
          sendDate: new Date().toISOString(),
        };
        setMessages((prevMessages) =>
          [...prevMessages, newMessage].sort(
            (a, b) => new Date(a.sendDate) - new Date(b.sendDate)
          )
        );
      }

      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) setHasNewMessage(false); // Reset notification when expanding
  };

  const handleNotificationClick = () => {
    setHasNewMessage(false); // Reset notification when clicked
  };

  return (
    <div className={`chat-window ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-header">
        <h3>{isMinimized ? "Chat" : `Chat with ${sellerName}`}</h3>
        <button onClick={handleMinimize}>
          {isMinimized ? "Expand" : "Minimize"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
      {!isMinimized && hasNewMessage && (
        <div
          className="notification-banner"
          onClick={handleNotificationClick}
        />
      )}
      <div className={`chat-messages ${isMinimized ? "hidden" : ""}`}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isSendByMe ? "user" : "seller"}`}
            >
              <p style={{ fontSize: 18 }}>{message.text}</p>
              {message.fileUrl && (
                <img
                  src={message.fileUrl}
                  alt="Attached file"
                  className="message-file"
                />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {!isMinimized && (
        <form onSubmit={handleSubmit(onSubmit)} className="chat-input">
          <input
            {...register("message", { required: true })}
            type="text"
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ChatWindow;
