import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useGetTeacherMutation } from "../store/rtk";

export default function Login({ keepUser }) {
  const [username, setUsername] = useState("");
  const [login, { isLoading }] = useGetTeacherMutation();

  const checkLogin = () => {
    login(username)
      .then(({ data, error }) => {
        if (error) throw new Error(error);
        if (data.doc) keepUser([data.doc.id, true]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Stack spacing={2} width={300} mx="auto" component="form">
      <Typography variant="h5" align="center">
        Access My Gradebook
      </Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
        autoComplete="username"
        disabled={isLoading}
      />
      <Button
        variant="contained"
        color="success"
        disabled={username === ""}
        onClick={checkLogin}
      >
        Connect
      </Button>
    </Stack>
  );
}
