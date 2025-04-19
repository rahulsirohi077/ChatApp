import React, { memo } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { sampleNotifications } from "../../constants/sampleData";
import { Add as AddIcon } from "@mui/icons-material";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notifications = () => {

  const {isNotification} = useSelector((state) => state.misc);
  const {isLoading, data, error, isError} = useGetNotificationsQuery();

  const dispatch = useDispatch();

  const [acceptRequest] = useAcceptFriendRequestMutation();

  const friendReuestHandler = async({_id,accept}) => {

    dispatch(setIsNotification(false));

    try {
      const res = await acceptRequest({requestId:_id, accept});

      if(res.data?.success) {
        console.log("Use Socket here");
        toast.success(res.data.message);
      }
      else{
        toast.error(res.data?.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
    
  };

  const closeHandler = () => {
    dispatch(setIsNotification(false));
  }

  useErrors([{isError, error}]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {
          isLoading ? <Skeleton/> : (<>
          {data?.allRequest.length > 0 ? (
          data?.allRequest?.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendReuestHandler}
              key={_id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>0 Notifications</Typography>
        )}
          </>)
        }

        
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const {name,avatar} = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar}/>

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>

        <Stack direction={{
          xs:"column",
          sm:"row"
        }}>
          <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
          <Button color="error" onClick={()=>handler({_id,accept:false})}>Reject</Button>
        </Stack>

      </Stack>
    </ListItem>
  );
})

export default Notifications;
