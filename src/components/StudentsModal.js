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
import CloseButton from "./CloseButton";
import {
  useCreateStudentMutation,
  useDeleteStudentMutation,
} from "../store/rtk";
import { Add, Delete } from "@mui/icons-material";
import ConfirmDialog from "./ConfirmDialog";
export default function StudentsModal({ students, open, toggle }) {
  const [postStudent] = useCreateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();
  const [name, setName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const createStudent = () => {
    postStudent(name)
      .then((resp) => {
        setName("");
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
        <Typography variant="h5" align="center" px={6}>
          STUDENTS
        </Typography>
        <List>
          {students.map(({ id, name, grades }, i) => {
            const gradeList = grades ? Object.values(grades) : [];
            const total =
              gradeList.length > 0
                ? gradeList.reduce(
                    (sum, { value }) => (sum.value || sum) + value
                  ) / gradeList.length
                : 0;
            return (
              <ListItem key={id}>
                <ListItemAvatar sx={{ minWidth: "unset" }}>
                  <Typography color="text.secondary" component="span" pr={1}>
                    {i + 1}.
                  </Typography>
                </ListItemAvatar>
                <ListItemText flex={1}>
                  {name}
                  <Typography variant="caption" pl={2}>
                    ({total.toFixed(2)})
                  </Typography>
                </ListItemText>
                <IconButton
                  color="error"
                  onClick={() => {
                    setConfirmData({
                      title: "Remove student",
                      description: `Delete ${name} records?`,
                      actions: [
                        {
                          action: () => deleteStudent(id),
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
            );
          })}
        </List>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="New Student"
            placeholder="Student Name"
            autoComplete="off"
          />
          <Button
            onClick={createStudent}
            variant="contained"
            disabled={name === ""}
          >
            <Add />
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
