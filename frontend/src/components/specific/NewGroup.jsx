import React, { useState } from "react";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";

const NewGroup = () => {
  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [members, setMembers] = useState(sampleUsers);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };


  const submitHandler = () => {
    
  };

  const closeHandler = () => {
    
  };

  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>

        <TextField
          value={groupName.value}
          onChange={groupName.changeHandler}
          label="Group Name"
        />

        <Typography variant="body1">Members</Typography>

        <Stack>
          {sampleUsers.map((i) => (
            <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
          ))}
        </Stack>

        <Stack direction={"row"} spacing={"1rem"} justifyContent={"space-evenly"}>
          <Button variant={"text"} color="error" size="large">
            Cancel
          </Button>
          <Button variant={"contained"} size="large" onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
