import React, { useContext, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { AiFillDelete } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { deleteDoc, doc } from "firebase/firestore"; // Import the deleteDoc function from Firestore
import { db } from "../../firebase";
import { MdOpenInBrowser } from "react-icons/md";

const UserInfo = () => {
  const { data, dispatch } = useContext(ChatContext);

  const [menu, setMenu] = useState(false);

  const handleMenu = () => {
    setMenu(!menu);
  };

  const handleChatDeletion = async () => {
    try {
      // Assuming 'data' contains the chatId of the active chat
      const chatId = data?.chatId;

      if (chatId) {
        // Delete the chat document using deleteDoc
        await deleteDoc(doc(db, "chats", chatId));
        console.log("Chat deleted successfully!");

        dispatch({ type: "CHAT_DELETED" });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="h-16 flex items-center justify-between ml-3 text-indigo-950">
      <div className="font-semibold text-2xl">{data.user?.displayName}</div>

      <div className="w-12 relative cursor-pointer">
        <div onClick={handleMenu}>
          <BiDotsVerticalRounded size={22} />
        </div>
        {menu && (
          <div className="absolute right-0 top-11 w-60 rounded-bl-xl bg-indigo-200 pl-3 ">
            <div
              onClick={handleChatDeletion}
              className="flex items-center gap-3 cursor-pointer h-14 active:scale-95 transition duration-200 ease-linear"
            >
              <div><AiFillDelete size={22} /></div>
              <div>Delete Conversation</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
