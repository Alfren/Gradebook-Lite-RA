import { useState } from "react";
import { Outlet } from "react-router";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Brightness6,
  Logout,
  MoreVert,
} from "@mui/icons-material";
import AR_Flag from "../images/AR-flag.svg";
import A from "../images/A+.png";
import ConfirmDialog from "./ConfirmDialog";
import { Link } from "react-router-dom";
import { logout } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteAccountMutation } from "../store/rtk";

export default function TitleBar({ toggleTheme }) {
  const dispatch = useDispatch();
  const {
    permitted,
    id: teacherId,
    username,
  } = useSelector((state) => state.user);
  const [deleteAccount, { isLoading: deleteIsLoading }] =
    useDeleteAccountMutation();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const handleDeleteAccount = () => {
    handleClose();
    deleteAccount(teacherId)
      .then(() => {
        dispatch(logout());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (deleteIsLoading) {
    return (
      <Backdrop open={deleteIsLoading} component={Stack}>
        <CircularProgress size={50} color="error" />
        <Typography align="center">Deleting account data</Typography>
        <Typography align="center">Please wait a few moments..</Typography>
      </Backdrop>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={confirmOpen}
        toggle={() => setConfirmOpen(!confirmOpen)}
        data={confirmData}
      />
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
            <>
              <Tooltip title="Account Options" arrow disableInteractive>
                <IconButton onClick={handleMenuClick}>
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={anchorEl !== null}
                onClose={handleClose}
              >
                <Typography
                  align="center"
                  py={1}
                  variant="h6"
                  color="text.secondary"
                >
                  {username}
                </Typography>
                <MenuItem
                  onClick={() => {
                    setConfirmData({
                      title: "Delete Your Account?",
                      description: `This is a permanent action`,
                      actions: [
                        {
                          action: handleDeleteAccount,
                          color: "error",
                          label: "DELETE",
                        },
                      ],
                    });
                    setConfirmOpen(true);
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography variant="inherit">Delete Account</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    window.localStorage.clear();
                    dispatch(logout());
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" color="warning" />
                  </ListItemIcon>
                  <Typography variant="inherit">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
          <Tooltip title="Toggle dark/light mode" arrow disableInteractive>
            <IconButton onClick={toggleTheme}>
              <Brightness6 />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
}
