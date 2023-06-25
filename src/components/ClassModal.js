import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseButton from "./CloseButton";
import { useCreateClassMutation, useDeleteClassMutation } from "../store/rtk";
import { useSelector } from "react-redux";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ConfirmDialog from "./ConfirmDialog";

export default function ClassModal({ open, toggle, classes }) {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const [postClass, { isLoading }] = useCreateClassMutation();
  const [removeClass, { isLoading: deleteIsLoading }] =
    useDeleteClassMutation();

  const createClass = () => {
    postClass({ title, teacherId })
      .then(({ error }) => {
        if (error) throw new Error(error.message);
        toggle();
        setTitle("");
        msg("Class created!", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Operation failed", { variant: "error" });
      });
  };

  const deleteClass = (id) => {
    removeClass(id)
      .then(({ error }) => {
        if (error) throw new Error(error.message);
        msg("Class deleted!", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Operation failed", { variant: "error" });
      });
  };

  return (
    <Dialog open={open} onClose={toggle}>
      <ConfirmDialog
        open={confirmOpen}
        toggle={() => setConfirmOpen(!confirmOpen)}
        data={confirmData}
      />
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
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => {
                    setConfirmData({
                      title: "Remove class",
                      description: `Delete ${title} and all records?`,
                      actions: [
                        {
                          action: () => deleteClass(id),
                          color: "error",
                          label: "DELETE",
                        },
                      ],
                    });
                    setConfirmOpen(true);
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Stack spacing={1} p={1} m={1} component={Paper}>
        <Typography>New Class</Typography>
        <Stack direction="row" columnGap={1}>
          <TextField
            label="New Class Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            size="small"
            fullWidth
            required
          />
          <Button
            variant="contained"
            color="success"
            size="small"
            disabled={isLoading || title === ""}
            onClick={createClass}
          >
            <Add />
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
