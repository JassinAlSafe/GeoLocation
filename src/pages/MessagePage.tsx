import React, { useEffect, useState } from "react";
import "../styles/MessagePage.css";

interface Message {
  username: string;
  text: string;
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(storedMessages);
  }, []);

  const clearMessages = () => {
    localStorage.removeItem("messages");
    setMessages([]);
  };

  return (
    <div>
      <h1>Posted Messages</h1>
    
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="message-bubble">
            <h3>Message: {message.text}</h3>
            <p> - {message.username}</p>
            
          </div>
          
        ))
        
      ) : (
        <p>No messages posted yet.</p>
      )}
      <div>
      <button onClick={clearMessages} className="clear-button">
        Clear Messages
      </button>
      </div>
    </div>
  );
};

export default MessagesPage;