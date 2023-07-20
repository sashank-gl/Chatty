// Message.js
import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";

const Message = ({ message, isCurrentUser }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

// Function to format the message timestamp
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const messageTime = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
  const diffInSeconds = (now - messageTime) / 1000;

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    // More than 6 days ago, show the exact date and time
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return messageTime.toLocaleString("en-US", options);
  }
};


  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={ref} className={`flex ${isCurrentUser ? "" : "justify-end"}`}>
      <div className="flex flex-col">
        <div className={`flex items-center ml-2 mr-2 gap-3 ${isCurrentUser ? "" : "flex-row-reverse"}`}>
          <img
            className="h-10 w-10 object-cover rounded-full"
            src={isCurrentUser ? data.user.photoURL : currentUser.photoURL}
            alt=""
          />
        
          <div className={`bg-white text-slate-900 p-1 pl-2 pr-2 rounded-xl ${isCurrentUser ? "rounded-bl-none" : "rounded-br-none"}`}>{message.text}</div>
          {message.img && (
            <img className="h-48 w-48 object-cover" src={message.img} alt="" />
          )}
        </div>
       <div className={`flex text-xs text-slate-600 ${isCurrentUser ? "ml-3 justify-start" : "justify-end mr-3"}`}>{formatTimestamp(message.date)}</div>
      </div>

      
    </div>
  );
};

export default Message;
