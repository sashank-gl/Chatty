import React, { useContext, useState } from "react";

import {MdAttachment} from 'react-icons/md'
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const UserInput = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [data.chatId + ".lastMessage"]: {
                text,
                img: downloadURL, // Store the download URL in the lastMessage object for reference
              },
              [data.chatId + ".date"]: serverTimestamp(),
            });

            setText("");
            setImg(null);
          });
        }
      );
    } else {
      // If there is no image, update the messages array without the 'img' field
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setText("");
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };
  
  return (
    <div className="h-16 flex items-center gap-5 justify-between">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="rounded-full ml-5 pl-2 h-12 flex-grow"
        onKeyPress={handleKeyPress}
      />
      <div className="flex gap-5 mr-5">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file" className="flex items-center -rotate-45"><MdAttachment size={22} color="#1e293b" /></label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default UserInput;
