import { useState } from "react";
import { Dialog, List, ListItem, Stack, Typography } from "@mui/material";
import CloseButton from "./CloseButton";
import { useCreateStudentMutation } from "../store/rtk";
export default function StudentsModal({ students, open, toggle }) {
  const [postStudent] = useCreateStudentMutation();
  const [name, setName] = useState("");

  const createStudent = () => {
    postStudent(name)
      .then((resp) => {
        console.log(resp.data);
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
            const gradeList = Object.values(grades);
            const total =
              gradeList.reduce((sum, { value }) => (sum.value || sum) + value) /
              gradeList.length;
            return (
              <ListItem key={id}>
                <Typography color="text.secondary" component="span" pr={1}>
                  {i + 1}.
                </Typography>
                {name}
                <Typography variant="caption" pl={2}>
                  ({total.toFixed(2)})
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Dialog>
  );
}
