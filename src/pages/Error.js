import { useNavigate } from "react-router";
import { Button, Stack, Typography } from "@mui/material";
import { East } from "@mui/icons-material";

export default function Error() {
  const navigate = useNavigate();
  return (
    <Stack spacing={4} mx="auto" width="fit-content">
      <Typography variant="h4" align="center">
        Page Not Found
      </Typography>
      <Button
        onClick={() => navigate("/")}
        variant="outlined"
        endIcon={<East />}
      >
        Go Home
      </Button>
    </Stack>
  );
}
