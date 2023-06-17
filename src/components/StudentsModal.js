import { useState } from "react";
import {
  Button,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseButton from "./CloseButton";
import { useCreateStudentMutation } from "../store/rtk";
import { Add } from "@mui/icons-material";
export default function StudentsModal({ students, open, toggle }) {
  const [postStudent] = useCreateStudentMutation();
  const [name, setName] = useState("");

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
                <ListItemText>
                  {name}
                  <Typography variant="caption" pl={2}>
                    ({total.toFixed(2)})
                  </Typography>
                </ListItemText>
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
