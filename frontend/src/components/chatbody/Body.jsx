import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { AuthContext } from "../../contexts/AuthContext"; // Import the AuthContext
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Message from "./Message";

const Body = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext); // Get the currentUser from AuthContext

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.chatId]);

  // Filter out messages from other conversations
  const currentUserMessages = messages.filter(
    (m) => m.senderId === data.user.uid || m.senderId === currentUser.uid
  );

  return (
    <div className="pt-2 ">
      {currentUserMessages.map((m) => (
        <Message message={m} key={m.id} isCurrentUser={m.senderId === data.user.uid} />
      ))}
    </div>
  );
};

export default Body;
