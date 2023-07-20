import React, { useContext } from "react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="h-12 w-screen bg-indigo-950 text-white flex fixed justify-between">
      <div className="flex items-center ml-5">Chatty</div>
      <div className="flex items-center gap-3 mr-5">
        <div><img className="w-8 h-8 object-cover rounded-full" src={currentUser.photoURL} /></div>
        <div>{currentUser.displayName}</div>
        <div onClick={() => signOut(auth)} className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
};

export default NavBar;
