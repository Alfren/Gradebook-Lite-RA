import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseButton from "./CloseButton";
import { useCreateClassMutation } from "../store/rtk";
import { useSelector } from "react-redux";
import { Delete, Description, People } from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function ClassModal({ open, toggle, classes }) {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [postClass, { isLoading }] = useCreateClassMutation();
  const createClass = () => {
    postClass({ title, teacherId })
      .then((resp) => {
        toggle();
        setTitle("");
        msg("Class created!", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Operation failed", { variant: "error" });
      });
  };

  return (
    <Dialog open={open} onClose={toggle}>
      <CloseButton action={toggle} />
      <Stack sx={{ p: 1, mt: 4 }}>
        {classes?.map(({ title, id, students, assignments }) => {
          let totalGrades = [];
          students.forEach(({ grades }) => {
            Object.values(grades).forEach((val) => {
              if (typeof val === "object") {
                totalGrades.push(val.TOTAL);
              } else {
                totalGrades.push(val);
              }
            });
          });
          return (
            <Stack
              key={id}
              component={Paper}
              direction="row"
              alignItems="center"
              sx={{ my: 0.5, py: 0.5, px: 2 }}
            >
              <Stack flex={1}>
                <Typography flex={1}>{title}</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography variant="caption">
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      Students:{" "}
                    </Typography>
                    {students.length}
                  </Typography>
                  <Typography variant="caption">
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      Assignments:{" "}
                    </Typography>
                    {assignments.length}
                  </Typography>
                  <Typography variant="caption">
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      Average Grade:{" "}
                    </Typography>
                    {totalGrades.length > 0
                      ? (
                          totalGrades.reduce((a, b) => a + b) /
                          totalGrades.length
                        ).toFixed(2)
                      : 0}
                  </Typography>
                </Stack>
              </Stack>
              <Box>
                {/* TODO: configure class delete */}
                <IconButton color="error" size="small">
                  <Delete />
                </IconButton>
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Stack spacing={1} p={1} m={1} component={Paper}>
        <Typography>New Class</Typography>
        <TextField
          label="New Class Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          size="small"
        />
        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={isLoading}
          onClick={createClass}
        >
          Create Class
        </Button>
      </Stack>
    </Dialog>
  );
}
