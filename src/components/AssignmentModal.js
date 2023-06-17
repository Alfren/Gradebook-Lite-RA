import { useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import {
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
} from "../store/rtk";
import ConfirmDialog from "./ConfirmDialog";
import CloseButton from "./CloseButton";

export default function AssignmentModal({ assignments, open, toggle }) {
  const [postAssignment] = useCreateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();
  const [assignment, setAssignment] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const createAssignment = () => {
    postAssignment(assignment)
      .then((resp) => {
        setAssignment("");
      })
      .catch((error) => {
        console.error(error);
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
      <Stack spacing={2} m={2}>
        <Typography variant="h5" px={4} align="center">
          ASSIGNMENTS
        </Typography>
        <List>
          {assignments.length > 0 &&
            assignments.map(({ title, id }, i) => (
              <ListItem key={id}>
                <ListItemAvatar sx={{ minWidth: "unset" }}>
                  <Typography color="text.secondary" component="span" pr={1}>
                    {i + 1}.
                  </Typography>
                </ListItemAvatar>
                <ListItemText flex={1}>{title}</ListItemText>
                <IconButton
                  color="error"
                  onClick={() => {
                    setConfirmData({
                      title: "Remove assignment",
                      description: `Delete ${title}?`,
                      actions: [
                        {
                          action: () => deleteAssignment(id),
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
              </ListItem>
            ))}
        </List>
        <Stack direction="row" columnGap={1}>
          <TextField
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            label="New Assignment"
            placeholder="Assignment name"
            fullWidth
            autoComplete="off"
          />
          <Button
            variant="contained"
            color="success"
            onClick={createAssignment}
            disabled={assignment === ""}
          >
            <Add />
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
