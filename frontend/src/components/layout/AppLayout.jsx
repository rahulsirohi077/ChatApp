import { Drawer, Grid2, Skeleton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrors } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobile } from "../../redux/reducers/misc";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    // console.log("chatid = "+chatId);

    const dispatch = useDispatch();

    const socket = getSocket();

    console.log(socket.id);

    const {isMobile} = useSelector((state) => state.misc);
    const {user} = useSelector((state) => state.auth);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{isError, error}]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete chat ", _id, groupChat);
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    return (
      <>
        <Title />
        <Header />

        {
          isLoading ? (<Skeleton/>) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
                w="70vw"
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
          </Drawer>)
        }

        <Grid2 container height={"calc(100vh - 4rem)"}>
          <Grid2
            item
            size={{ sm: 4, md: 3 }}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
            )}
          </Grid2>
          <Grid2 item size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
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
            <Profile user={user}/>
          </Grid2>
        </Grid2>
      </>
    );
  };
};

export default AppLayout;
