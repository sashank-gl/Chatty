import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";
import { ChatContext } from "../contexts/ChatContext";

const Search = ({ onSelect }) => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const userRef = collection(db, "users");
    const lowerCaseUsername = username.toLowerCase(); 

    const q = query(
      userRef,
      where("email", "==", lowerCaseUsername)
    );
  
    const q1 = query(
      userRef,
      where("displayName", "==", lowerCaseUsername)
    );
  
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } else {
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach((doc) => {
          setUser(doc.data());
        });
      }
      setErr(false); // Reset the error state in case the previous search had an error.
    } catch (err) {
      setErr(true);
    }
  };
  

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    console.log("HandleSelect Function is Clicked");

    const combinedId = [currentUser.uid, user.uid].sort().join("_");

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      dispatch({ type: "SET_ACTIVE_CHAT", payload: combinedId });
    } catch (err) {}

    setUser(null);
    setUsername("");
    dispatch({ type: "CHANGE_USER", payload: user });
    onSelect(user);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setUsername(inputValue);
  };

  return (
    <div className="w-full text-slate-700 md:pt-12">
      <div className="">
        <input
          className="h-16 w-full border-b pl-2 focus:outline-none focus:border-transparent"
          type="text"
          placeholder="Search User"
          onKeyDown={handleKey}
          onChange={handleChange}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="bg-white flex justify-between items-center cursor-pointer rounded-b-lg h-16">
          <div onClick={handleSelect} className="flex">
            <img
              className="ml-2 h-10 w-10 object-cover rounded-full"
              src={user.photoURL}
              alt=""
            />
            <div className="ml-3">
              <div className="text-xl">{user?.displayName ? user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1).toLowerCase() : ''}</div>
              <div className="text-xs">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
