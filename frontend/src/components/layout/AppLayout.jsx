import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import {  Grid2 } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    // console.log("chatid = "+chatId);

    const handleDeleteChat = (e,_id,groupChat) => {
      e.preventDefault();
      console.log("Delete chat ",_id,groupChat);
    };

    return (
    <>
      <Title />
      <Header />
      <Grid2 container height={"calc(100vh - 4rem)"}>
        <Grid2
          item
          size={{ sm: 4, md: 3 }}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height={"100%"}
        >
          <ChatList 
            chats={sampleChats} 
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
          />
        </Grid2>
        <Grid2 item  size={{ xs: 12, sm: 8, md:5, lg:6 }} height={"100%"}>
          <WrappedComponent {...props} />
        </Grid2>
        <Grid2
          item
          size={{ md: 4, lg: 3 }}
          sx={{
            display: { xs: "none", md: "block" },
            padding: "2rem",
            bgcolor: "rgba(0,0,0,0.85)",
          }}
          height={"100%"}
        >
          <div >Right Sidebar</div>
        </Grid2>
      </Grid2>
    </>
    );
  };
};

export default AppLayout;
