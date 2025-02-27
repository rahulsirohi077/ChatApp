import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import {  Grid2 } from "@mui/material";
import ChatList from "../specific/ChatList";

const AppLayout = () => (WrappedComponent) => {
  return (props) => (
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
          <ChatList chats={[1,2,3,4,5]}/>
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

export default AppLayout;
