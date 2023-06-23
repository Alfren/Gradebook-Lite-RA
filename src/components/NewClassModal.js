import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import CloseButton from "./CloseButton";
import { useCreateClassMutation } from "../store/rtk";
import { useSelector } from "react-redux";

export default function NewClassModal({ open, toggle }) {
  const { id: teacherId } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [postClass, { isLoading }] = useCreateClassMutation();
  const createClass = () => {
    postClass({ title, teacherId })
      .then((resp) => {
        toggle();
        setTitle("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Dialog open={open} onClose={toggle}>
      <CloseButton action={toggle} />
      <DialogTitle>New Class</DialogTitle>
      <DialogContent>
        <Stack spacing={1} my={1}>
          <TextField
            label="New Class Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            color="success"
            disabled={isLoading}
            onClick={createClass}
          >
            Create Class
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
