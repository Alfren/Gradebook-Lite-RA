import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useCreateTeacherMutation, useGetTeacherMutation } from "../store/rtk";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setUserAssets } from "../store/userSlice";
import { East, West } from "@mui/icons-material";

export default function Login() {
  const { closeSnackbar: msg } = useSnackbar();
  const [username, setUsername] = useState("");
  const [newAccountForm, setNewAccountForm] = useState(false);
  const [login, { isLoading: getTeacherIsloading }] = useGetTeacherMutation();
  const [createTeacher, { isLoading: newTeacherisLoading }] =
    useCreateTeacherMutation();

  const dispatch = useDispatch();
  const { permitted } = useSelector((state) => state.user);

  const checkLogin = () => {
    login(username)
      .then(({ data, error }) => {
        if (error) throw new Error(error);
        if (data === null) {
          msg("Username not found.", { variant: "warning" });
          return;
        }
        if (data.id && data.username)
          dispatch(
            setUserAssets({
              id: data.id,
              permitted: true,
              username: data.username,
            })
          );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createNewTeacher = () => {
    createTeacher({ username })
      .then(({ data, error }) => {
        if (error) throw new Error(error);
        if (data.id && data.username)
          dispatch(
            setUserAssets({
              id: data.id,
              permitted: true,
              username: data.username,
            })
          );
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
            onClick={() => setNewAccountForm(false)}
            startIcon={<West />}
          >
            Back To Login
          </Button>
        </>
      ) : (
        <>
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
            onClick={() => setNewAccountForm(true)}
            endIcon={<East />}
          >
            Create New Account
          </Button>
        </>
      )}
    </Stack>
  );
}
