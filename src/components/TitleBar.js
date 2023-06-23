import { Outlet } from "react-router";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Brightness6, Logout } from "@mui/icons-material";
import AR_Flag from "../images/AR-flag.svg";
import A from "../images/A+.png";
import { Link } from "react-router-dom";
import { logout } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
export default function TitleBar({ toggleTheme }) {
  const dispatch = useDispatch();
  const { permitted } = useSelector((state) => state.user);
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        p={1}
        mb={3}
        component={Paper}
      >
        <Stack direction="row">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
            }}
            title="Gradebook 🇦🇷 - Home"
          >
            <Box component="img" src={A} height={30} sx={{ mx: 1 }} />
            <Typography variant="h5">
              Gradebook{" "}
              <img
                src={AR_Flag}
                width={20}
                style={{ position: "relative", top: 3 }}
                alt="AR"
                title="Argentina (AR)"
              />
            </Typography>
          </Link>
        </Stack>
        <Stack direction="row" spacing={2}>
          {permitted && (
            <Tooltip title="Logout" arrow disableInteractive>
              <IconButton onClick={() => dispatch(logout())} color="error">
                <Logout />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={toggleTheme}>
            <Brightness6 />
          </IconButton>
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
}
