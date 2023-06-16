import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function Error() {
  const navigate = useNavigate();
  return (
    <Stack spacing={4} mx="auto" width="fit-content">
      <Typography variant="h4" align="center">
        Page Not Found
      </Typography>
      <Button onClick={() => navigate("/")}>Go Home</Button>
    </Stack>
  );
}
