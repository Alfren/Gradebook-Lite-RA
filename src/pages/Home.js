import { useState } from "react";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useGetGradesQuery, useGetStudentsQuery } from "../store/rtk";
import { Groups, Refresh, Settings } from "@mui/icons-material";
import StudentsModal from "../components/StudentsModal";
import { useSnackbar } from "notistack";

export default function Home() {
  const { closeSnackbar: msg } = useSnackbar();
  const {
    data: students = [],
    refetch: refetchStudents,
    isFetching: studentsFetching,
  } = useGetStudentsQuery();
  const {
    data: grades = [],
    refetch: refetchGrades,
    isFetching: gradesFetching,
  } = useGetGradesQuery();
  const refetchData = () => {
    refetchStudents();
    refetchGrades();
    msg("It worked. Data refreshed.", { variant: "success" });
  };
  const [studentModal, setStudentModal] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const toggleStudentModal = () => setStudentModal(!studentModal);
  const toggleAssignmentModal = () => setAssignmentModal(!assignmentModal);
  return (
    <Container component={Paper} sx={{ p: 2 }}>
      <StudentsModal
        students={students}
        open={studentModal}
        toggle={toggleStudentModal}
      />
      <Stack direction="row-reverse" columnGap={1}>
        <Button
          variant="outlined"
          endIcon={<Groups />}
          onClick={toggleStudentModal}
        >
          Students
        </Button>
        <Button
          variant="outlined"
          endIcon={<Settings />}
          onClick={toggleAssignmentModal}
        >
          Assignments
        </Button>
        <Tooltip title="Refetch data" arrow disableInteractive>
          <IconButton onClick={refetchData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell role="heading" sx={{ fontWeight: 900 }}>
              Student
            </TableCell>
            {grades.length > 0 &&
              grades.map((entry) => (
                <TableCell
                  key={`assignment-${entry.id}`}
                  sx={{ fontWeight: 900, textAlign: "center" }}
                >
                  {entry.title}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length > 0 &&
            students.map(({ id, name, grades: studentGrades }) => {
              return (
                <TableRow key={id}>
                  <TableCell sx={{ fontWeight: 900 }}>{name}</TableCell>
                  {studentGrades !== undefined &&
                    grades.length > 0 &&
                    grades.map(({ id: gradeId }) => (
                      <TableCell key={gradeId} align="center">
                        {studentGrades?.[gradeId]?.value || "-"}
                      </TableCell>
                    ))}
                </TableRow>
              );
              // return [
              //   <Stack
              //     key={`stack-${entry.id}`}
              //     direction="row"
              //     columnGap={3}
              //     alignItems="center"
              //   >
              //     <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
              //       {entry.name}
              //     </Typography>
              //     <Divider orientation="vertical" flexItem />
              //     <Grid container columnGap={3}>
              //       {studentGrades.map((item) => (
              //         <Grid item key={item.id} align="center">
              //           <Typography variant="caption" color="text.secondary">
              //             {item.title}
              //           </Typography>
              //           <Typography>{item.grade}</Typography>
              //         </Grid>
              //       ))}
              //     </Grid>
              //   </Stack>,
              //   <Divider key={`divider-${entry.id}`} />,
              // ];
            })}
        </TableBody>
      </Table>
    </Container>
  );
}
