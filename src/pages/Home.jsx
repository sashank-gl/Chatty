import React from "react";
import NavBar from "../components/NavBar";
import Chats from "../components/Chats";
import ChatBody from "../components/ChatBody";

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-rose-500 to-sky-500">
      <div className="">
      <NavBar />
      <Chats />
      </div>
    </div>
  );
};

export default Home;
