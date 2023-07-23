import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { AuthContext } from "../../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Message from "./Message";

const Body = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Ensure that both data and currentUser are available before proceeding
    if (data && data.chatId && currentUser) {
      const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        const messagesData = doc.data()?.messages || [];
        setMessages(messagesData);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [data, currentUser]);

  // Check if messages array is undefined or null, and initialize as an empty array
  const currentUserMessages = messages || [];

  return (
    <div className="pt-4 pr-2">
      {currentUserMessages.map((m) => (
        <Message message={m} key={m.id} isCurrentUser={m.senderId === data?.user?.uid} />
      ))}
    </div>
  );
};

export default Body;
