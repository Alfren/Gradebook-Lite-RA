import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateTeacherMutation, useGetTeacherMutation } from "../store/rtk";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setUserAssets } from "../store/userSlice";
import { East, West } from "@mui/icons-material";

export default function Login() {
  const { closeSnackbar: msg } = useSnackbar();
  const [username, setUsername] = useState("");
  const [rememberCheck, setRememberCheck] = useState(false);
  const [error, setError] = useState("");
  const [newAccountForm, setNewAccountForm] = useState(false);
  const [login, { isLoading: getTeacherIsloading }] = useGetTeacherMutation();
  const [createTeacher, { isLoading: newTeacherisLoading }] =
    useCreateTeacherMutation();

  const dispatch = useDispatch();
  const { permitted } = useSelector((state) => state.user);

  const checkLogin = (rememberedUser) => {
    setError("");
    login(username || rememberedUser)
      .then(({ data, error }) => {
        if (error) throw new Error(error);
        if (data === null) {
          msg("Username not found.", { variant: "warning" });
          setError("Username not found.");
          return;
        }
        if (data.id && data.username) {
          if (rememberCheck)
            window.localStorage.setItem("gradebook-user", username);
          dispatch(
            setUserAssets({
              id: data.id,
              permitted: true,
              username: data.username,
            })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const rememberedUser = window.localStorage.getItem("gradebook-user");
    if (rememberedUser && !permitted) checkLogin(rememberedUser);
  }, []);

  const createNewTeacher = () => {
    createTeacher({ username })
      .then(({ data, error }) => {
        if (error) throw new Error(error);
        if (data.id && data.username) {
          msg("Account created!", { variant: "success" });
          dispatch(
            setUserAssets({
              id: data.id,
              permitted: true,
              username: data.username,
            })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Stack spacing={2} width={300} mx="auto">
      <Typography variant="h5" align="center">
        {newAccountForm ? "Create" : "Access"} My Gradebook
      </Typography>
      <TextField
        label={newAccountForm ? "New Username" : "Username"}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
        autoComplete="username"
        disabled={getTeacherIsloading || permitted}
        error={error !== ""}
        helperText={error}
      />
      {newAccountForm ? (
        <>
          <Button
            variant="contained"
            disabled={username === "" || newTeacherisLoading || permitted}
            onClick={createNewTeacher}
          >
            Create Account
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setNewAccountForm(false);
              setError("");
            }}
            startIcon={<West />}
          >
            Back To Login
          </Button>
        </>
      ) : (
        <>
          <InputLabel htmlFor="rememberCheck">
            <Stack direction="row" spacing={1} alignItems="center">
              <Checkbox
                id="rememberCheck"
                checked={rememberCheck}
                onChange={(e, checked) => setRememberCheck(checked)}
              />
              <Typography>Remember me</Typography>
            </Stack>
          </InputLabel>
          <Button
            variant="contained"
            color="success"
            disabled={username === "" || getTeacherIsloading || permitted}
            onClick={checkLogin}
          >
            Connect
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setNewAccountForm(true);
              setError("");
            }}
            endIcon={<East />}
          >
            Create New Account
          </Button>
        </>
      )}
    </Stack>
  );
}
