import { useState, useRef } from "react";
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
import { useSelector } from "react-redux";

export default function StudentsModal({ students, open, toggle, classId }) {
  const [postStudent] = useCreateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();
  const [name, setName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const { id: teacherId } = useSelector((state) => state.user);

  const createStudent = () => {
    postStudent({ name, teacherId, classId })
      .then(({ error }) => {
        if (error) throw new Error(error);
        setName("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const studentInputRef = useRef();

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
          {students.length > 0 ? (
            students.map(({ id, name, grades }, i) => {
              let list = [];
              Object.values(JSON.parse(JSON.stringify(grades))).forEach(
                (val) => {
                  typeof val === "object"
                    ? list.push(val.TOTAL)
                    : list.push(val);
                }
              );
              const total =
                list.length > 0
                  ? list.reduce((sum, value) => sum + value) / list.length
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
                            action: () => deleteStudent({ id, classId }),
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
            })
          ) : (
            <Typography variant="h6" align="center" color="text.secondary">
              Class is empty!
            </Typography>
          )}
        </List>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name !== "") createStudent();
            }}
            label="New Student"
            placeholder="Student Name"
            autoComplete="off"
            inputRef={studentInputRef}
            fullWidth
            required
          />
          <Button
            onClick={createStudent}
            variant="contained"
            color="success"
            disabled={name === ""}
          >
            <Add />
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
