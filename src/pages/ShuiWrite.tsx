import React, { useState } from "react";
import "../styles/ShuiWrite.css";
import { useNavigate } from "react-router-dom";

const ShuiWrite: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const handlePost = () => {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    const newMessage = { username, text };
    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));
    navigate("/message");
  };

  return (
    <div className="ShuiHome">
        <div>
            <h1>Write Something!</h1>
        </div>
      <input
        type="text"
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your message here"
        className="text-input"
      />
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="username-input"
      />
      <button onClick={handlePost} className="post-button">
        Post
      </button>
    </div>
  );
};

export default ShuiWrite;