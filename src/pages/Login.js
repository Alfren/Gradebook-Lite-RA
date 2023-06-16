import { Button, Stack, TextField, Typography } from "@mui/material";

export default function Login() {
  return (
    <Stack spacing={2} width={300} mx="auto" component="form">
      <Typography variant="h5" align="center">
        Login
      </Typography>
      <TextField
        label="Username/Email"
        fullWidth
        required
        autoComplete="username"
      />
      <TextField
        label="Password"
        fullWidth
        required
        type="password"
        autoComplete="current-password"
      />
      <Button variant="contained" color="success">
        Login
      </Button>
    </Stack>
  );
}
