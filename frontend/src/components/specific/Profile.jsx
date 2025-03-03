import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon
} from "@mui/icons-material";
import moment from "moment";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "cover",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"lorem ipsum haduqw"} />
      <ProfileCard heading={"Username"} text={"meAtInsta"} Icon={<UserNameIcon />} />
      <ProfileCard heading={"Name"} text={"Example for name"} Icon={<FaceIcon />} />
      <ProfileCard heading={"Joined"} text={moment('2023-11-04T18:30:00.000Z').fromNow()} Icon={<CalendarIcon />} />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    spacing={"1rem"}
    alignItems={"center"}
    direction={"row"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}

    <Stack>
      <Typography variant={"body1"}>{heading}</Typography>
      <Typography color="gray" variant={"caption"}>{text}</Typography>
    </Stack>
  </Stack>
);

export default Profile;
