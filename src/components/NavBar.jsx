import React, { useContext } from "react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="h-12 mt-24 md:mt-0 md:w-main w-80 rounded-t-3xl bg-indigo-800 text-white flex md:fixed justify-between">
      <div className="flex items-center ml-5 font-righteous">Chatty</div>
      <div className="flex items-center gap-3 mr-5">
        <div className="flex  items-center gap-3  rounded-full min-w-min p-1 pl-3 pr-3 text-white font-semibold">
          <img className="w-8 h-8 object-cover rounded-full" src={currentUser.photoURL} alt="profile" />
          {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() + currentUser.displayName.slice(1).toLowerCase() : ''}
</div>
        <div onClick={() => signOut(auth)} className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
};

export default NavBar;
