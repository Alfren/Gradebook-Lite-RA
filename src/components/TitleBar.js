import { Outlet } from "react-router";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { Brightness6 } from "@mui/icons-material";
import AR_Flag from "../images/AR-flag.svg";

export default function TitleBar({ toggleTheme, mode }) {
  // const navigate = useNavigate();
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        p={1}
        mb={3}
        component={Paper}
      >
        <Typography variant="h5">
          Gradebook Lite{" "}
          <img
            src={AR_Flag}
            width={20}
            style={{ position: "relative", top: 3 }}
            alt="AR"
            title="Argentina (AR)"
          />
        </Typography>
        <Stack direction="row" spacing={2}>
          {/* <Button onClick={() => navigate("/")}>Home</Button> */}
          <IconButton onClick={toggleTheme}>
            <Brightness6 />
          </IconButton>
          {/* <Button onClick={() => navigate("/login")}>Login</Button> */}
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
}
