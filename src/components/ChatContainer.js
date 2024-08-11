// ChatContainer.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "./ChatContainer.css";

function ChatContainer({
  isChatListOpen,
  activeChatSellerId,
  activeChatSellerName,
  handleChatClick,
  handleCloseChat,
}) {
  return (
    <>
      <motion.div
        className={`chat-list-container ${isChatListOpen ? "open" : ""}`}
        initial={false}
        animate={isChatListOpen ? { width: "35%" } : { width: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isChatListOpen && <ChatList onSelectChat={handleChatClick} />}
      </motion.div>

      <AnimatePresence>
        {activeChatSellerId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <ChatWindow
              sellerId={activeChatSellerId}
              onClose={handleCloseChat}
              sellerName={activeChatSellerName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatContainer;
