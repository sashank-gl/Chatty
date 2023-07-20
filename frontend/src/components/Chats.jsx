import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ChatContext } from "../contexts/ChatContext";
import { db } from "../firebase";
import Search from "./Search";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);
  console.log(currentUser);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelectedChat(u.uid);
  };

  return (
    <div className="w-1/4 bg-white">
      <Search />
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className={`flex p-2 border-b items-center cursor-pointer ${
                selectedChat === chat[1].userInfo.uid && "bg-indigo-100"
              }`}
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img
                className="h-10 w-10 object-cover rounded-full"
                src={chat[1].userInfo.photoURL}
                alt=""
              />
              <div className=" ml-3">
                <div className="text-xl">{chat[1].userInfo.displayName}</div>
                <div className="text-xs">{chat[1].lastMessage?.text}</div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;
