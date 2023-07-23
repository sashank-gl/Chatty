import React, { useContext, useEffect, useState } from "react";

import { MdAttachment } from "react-icons/md";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  getDoc,
  setDoc,
  FieldValue,
} from "firebase/firestore";

import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const UserInput = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [fileNames, setFileNames] = useState('');

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log(data,'data')


  const handleSend = async () => {
    if (text && text.trim().length > 0) {
      // Send text message
      const newMessage = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      };
  
      const chatDocRef = doc(db, "chats", data.chatId);
      const chatDocSnapshot = await getDoc(chatDocRef);
  
      if (chatDocSnapshot.exists()) {
        // The document exists, so you can update it.
        const existingMessages = chatDocSnapshot.data().messages || [];
        const updatedMessages = [...existingMessages, newMessage];
        await updateDoc(chatDocRef, {
          messages: updatedMessages,
        });
      } else {
        // The document does not exist, so you can create it.
        await setDoc(chatDocRef, {
          messages: [newMessage],
        });
      }
  
      setText("");
    }
  
    if (img && img.length > 0) {
      // Send image messages
      for (let i = 0; i < img.length; i++) {
        const image = img[i];
        const storageRef = ref(storage, uuid());
  
        try {
          const uploadTaskSnapshot = await uploadBytesResumable(storageRef, image);
          const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
  
          const chatDocRef = doc(db, "chats", data.chatId); // Define chatDocRef here for image messages
  
          // Check if the chat document exists before updating it with the image message
          const chatDocSnapshot = await getDoc(chatDocRef);
          if (chatDocSnapshot.exists()) {
            // Send the image message by adding to the messages array
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: "", // No text for image messages
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
  
            // Update the userChats document with the last image message
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [data.chatId + ".lastMessage"]: {
                text: "", // No text for image messages
                img: downloadURL, // Store the download URL in the lastMessage object for reference
              },
              [data.chatId + ".date"]: serverTimestamp(),
            });
  
            setImg(null);
          } else {
            // The chat document does not exist, so create it with the initial image message
            await setDoc(chatDocRef, {
              messages: [
                {
                  id: uuid(),
                  text: "", // No text for image messages
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                },
              ],
            });
  
            // Update the userChats document with the last image message
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [data.chatId + ".lastMessage"]: {
                text: "", // No text for image messages
                img: downloadURL, // Store the download URL in the lastMessage object for reference
              },
              [data.chatId + ".date"]: serverTimestamp(),
            });
  
            setImg(null);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }
  };
  


  
  

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    handleSend(); // Automatically send images when they are selected
  }, [img]);

  return (
    <div className="h-16 flex items-center gap-5 justify-between">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="rounded-full ml-3 pl-5 h-12 flex-grow"
        onKeyPress={handleKeyPress}
      />
      <div className="flex gap-5 mr-5">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          multiple
          onChange={(e) => setImg(e.target.files)}
        />
        <label htmlFor="file" className="flex items-center cursor-pointer -rotate-45">
          <MdAttachment size={22} color="#1e293b" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default UserInput;
