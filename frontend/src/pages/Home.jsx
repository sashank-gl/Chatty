import React from "react";
import NavBar from "../components/NavBar";
import Chats from "../components/Chats";
import ChatBody from "../components/ChatBody";

const Home = () => {
  return (
    <div className="">
      <NavBar />
      <div className="flex h-screen pt-12">
        <Chats />
        <ChatBody />
      </div>
    </div>
  );
};

export default Home;
