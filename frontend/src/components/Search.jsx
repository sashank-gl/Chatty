// import React, { useContext, useState } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   setDoc,
//   doc,
//   updateDoc,
//   serverTimestamp,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "../firebase"
// import { AuthContext } from "../contexts/AuthContext";
// const Search = () => {
//   const [username, setUsername] = useState("");
//   const [user, setUser] = useState(null);
//   const [err, setErr] = useState(false);

//   const { currentUser } = useContext(AuthContext);

//   const handleSearch = async () => {
//     const q = query(
//       collection(db, "users"),
//       where("displayName", "==", username)
//     );

//     try {
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         setUser(doc.data());
//       });
//     } catch (err) {
//       setErr(true);
//     }
//   };

//   const handleKey = (e) => {
//     e.code === "Enter" && handleSearch();
//   };

//   const handleSelect = async () => {
//     //check whether the group(chats in firestore) exists, if not create
//     const combinedId =
//       currentUser.uid > user.uid
//         ? currentUser.uid + user.uid
//         : user.uid + currentUser.uid;
//     try {
//       const res = await getDoc(doc(db, "chats", combinedId));

//       if (!res.exists()) {
//         //create a chat in chats collection
//         await setDoc(doc(db, "chats", combinedId), { messages: [] });

//         //create user chats
//         await updateDoc(doc(db, "userChats", currentUser.uid), {
//           [combinedId + ".userInfo"]: {
//             uid: user.uid,
//             displayName: user.displayName,
//             photoURL: user.photoURL,
//           },
//           [combinedId + ".date"]: serverTimestamp(),
//         });

//         await updateDoc(doc(db, "userChats", user.uid), {
//           [combinedId + ".userInfo"]: {
//             uid: currentUser.uid,
//             displayName: currentUser.displayName,
//             photoURL: currentUser.photoURL,
//           },
//           [combinedId + ".date"]: serverTimestamp(),
//         });
//       }
//     } catch (err) {}

//     setUser(null);
//     setUsername("")
//     console.log('Search Function Clicked')
//   };
//   return (
//     <div>
//       <div>
//         <input
//           type="text"
//           placeholder="Find a user"
//           onKeyDown={handleKey}
//           onChange={(e) => setUsername(e.target.value)}
//           value={username}
//         />
//       </div>
//       {err && <span>User not found!</span>}
//       {user && (
//         <div onClick={handleSelect} className="cursor-pointer flex">
//           <img className="h-10 w-10 object-cover" src={user.photoURL} alt="" />
//           <div>{user.displayName}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;

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

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    console.log("HandleSelect Function is Clicked");
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
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
    } catch (err) {}

    setUser(null);
    setUsername("");
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="w-full text-slate-700 ">
      <div className="">
        <input
          className="h-12 w-full  border-b pl-2"
          type="text"
          placeholder="Search User"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div
          className="bg-white flex items-center cursor-pointer rounded-b-lg h-16"
          onClick={handleSelect}
        >
          <img className="ml-2 h-10 w-10 object-cover rounded-full" src={user.photoURL} alt="" />
          <div className="ml-3">
            <div className="text-xl">{user.displayName}</div>
            <div className="text-xs">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
