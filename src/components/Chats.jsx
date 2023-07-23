import { doc, onSnapshot, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ChatContext } from "../contexts/ChatContext";
import { db } from "../firebase";
import Search from "./Search";
import { v4 as uuid } from "uuid";
import ChatBody from "./ChatBody";

const Chats = () => {

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [lastMessages, setLastMessages] = useState({});
  const [showChatBody, setShowChatBody] = useState(false);

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

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelectedChat(u.uid);
    setShowChatBody(true);
  };
  console.log(selectedChat, "Selected Chat");

  const handlelastMessage = async () => {
    if (!data || !data.chatId || !currentUser) {
      console.error("Missing data or currentUser");
      return;
    }

    const chatDocRef = doc(db, "chats", data.chatId);
    const chatDocSnapshot = await getDoc(chatDocRef);
    const existingMessages = chatDocSnapshot.data()?.messages || [];
    if (existingMessages.length > 0) {
      const lastMessage = existingMessages[existingMessages.length - 1];

      // Update the last messages state using the chatId as the key
      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages,
        [data.chatId]: lastMessage,
      }));
    }
    console.log(existingMessages, "Inside Existing Messages");
  };

  useEffect(() => {
    // Call the function when the component mounts to get the last message
    handlelastMessage();
  }, [selectedChat]);

  console.log("Last Messages", lastMessages);

  return (
    <div className="flex w-main h-main bg-white rounded-t-3xl">
      <div className="w-1/4 rounded-t-3xl border-r">
        <Search onSelect={handleSelect} />
        {chats &&
          Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat) => {
              const chatId = chat[0];
              const chatData = chat[1];
              console.log(chatData, "ChatData");
              return (
                <div>
                  {chatData.userInfo ? (
                <div
                  className={`flex h-16 p-2 border-b justify-between items-center cursor-pointer ${
                    selectedChat === chatData?.userInfo?.uid
                      ? "bg-indigo-100"
                      : ""
                  }`}
                  key={chatId}
                  onClick={() => handleSelect(chatData?.userInfo)}
                >
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 object-cover rounded-full"
                      src={chatData?.userInfo?.photoURL}
                      alt=""
                    />
                    <div className="ml-3 text-xl">
                      {chatData?.userInfo?.displayName}
                    </div>
                  </div>
                </div>
                ):(
                  <div></div>
                )}
                </div>
              );
            })}
      </div>
      <div className="w-3/4">{showChatBody && <ChatBody />}</div>
    </div>
  );
};

export default Chats;
