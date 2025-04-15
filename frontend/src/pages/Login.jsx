import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { bgGradient } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );

      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("avatar", avatar.file);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        backgroundImage: bgGradient,
      }}
    >
      <Container
        component={"main"}
        maxWidth={"xs"}
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
        >
          {isLogin ? (
            <>
              <Typography variant={"h5"}>Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  margin={"normal"}
                  required
                  fullWidth
                  label={"Username"}
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  margin={"normal"}
                  required
                  fullWidth
                  label={"Password"}
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={password.value}
                  onChange={password.changeHandler}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  fullWidth
                  type={"submit"}
                  color={"primary"}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  Or
                </Typography>
                <Button fullWidth variant="text" onClick={toggleLogin}>
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant={"h5"}>Sign Up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack width={"10rem"} margin={"auto"} position={"relative"}>
                  <Avatar
                    sx={{
                      width: "8rem",
                      height: "8rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      color: "white",
                      bgcolor: "rgb(0,0,0,0.5)",
                      ":hover": { bgcolor: "rgb(0,0,0,0.7)" },
                    }}
                    component={"label"} // This makes the IconButton act as a label for the hidden file input
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                      {/* The hidden file input is triggered by the label */}
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    color={"red"}
                    variant="caption"
                    display={"block"}
                    width={"fit-content"}
                    margin={"auto"}
                  >
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  margin={"normal"}
                  required
                  fullWidth
                  label={"Name"}
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  margin={"normal"}
                  required
                  fullWidth
                  label={"Bio"}
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  margin={"normal"}
                  required
                  fullWidth
                  label={"Username"}
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {username.error && (
                  <Typography color={"red"} variant="caption">
                    {username.error}
                  </Typography>
                )}
                <TextField
                  margin={"normal"}
                  required
                  fullWidth
                  label={"Password"}
                  variant="outlined"
                  type={"password"}
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color={"red"} variant="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  fullWidth
                  type={"submit"}
                  color={"primary"}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  Or
                </Typography>
                <Button fullWidth variant="text" onClick={toggleLogin}>
                  Log In Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
