import React, { useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloseButton from "./CloseButton";
import { useDeleteClassMutation } from "../store/rtk";
import { Delete, KeyboardArrowDown } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ConfirmDialog from "./ConfirmDialog";
import NewClassStepper from "./NewClassStepper";

export default function ClassModal({ open, toggle, classes }) {
  const { enqueueSnackbar: msg } = useSnackbar();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const [removeClass, { isLoading: deleteIsLoading }] =
    useDeleteClassMutation();

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
      <Typography variant="h5" align="center" p={2} px={6}>
        MANAGE CLASSES
      </Typography>
      <Stack sx={{ p: 1 }}>
        {classes.length > 0 ? (
          classes?.map(({ title, id, students, assignments }) => {
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
                <Box ml={3}>
                  <IconButton
                    color="error"
                    size="small"
                    disabled={deleteIsLoading}
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
          })
        ) : (
          <Typography pt={2} color="text.secondary">
            Create your first class!
            <KeyboardArrowDown
              sx={{ display: "block", fontSize: 40, width: 170 }}
            />
          </Typography>
        )}
      </Stack>
      <NewClassStepper toggle={toggle} />
    </Dialog>
  );
}
