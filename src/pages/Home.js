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
import { useGetAssignmentsQuery, useGetStudentsQuery } from "../store/rtk";
import { Description, Groups, Refresh } from "@mui/icons-material";
import StudentsModal from "../components/StudentsModal";
import { useSnackbar } from "notistack";
import AssignmentModal from "../components/AssignmentModal";

export default function Home() {
  const { closeSnackbar: msg } = useSnackbar();
  const {
    data: students = [],
    refetch: refetchStudents,
    isFetching: studentsFetching,
  } = useGetStudentsQuery();

  const {
    data: assignments = [],
    refetch: refetchAssignments,
    isFetching: assignmentsFetching,
  } = useGetAssignmentsQuery();

  const refetchData = () => {
    refetchStudents();
    refetchAssignments();
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
      <AssignmentModal
        assignments={assignments}
        open={assignmentModal}
        toggle={toggleAssignmentModal}
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
          endIcon={<Description />}
          onClick={toggleAssignmentModal}
        >
          Assignments
        </Button>
        <Tooltip title="Refetch data" arrow disableInteractive>
          <span>
            <IconButton
              onClick={refetchData}
              color="primary"
              disabled={studentsFetching || assignmentsFetching}
            >
              <Refresh />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell role="heading" sx={{ fontWeight: 900 }}>
              Student
            </TableCell>
            {assignments.length > 0 &&
              assignments.map((entry) => (
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
                    assignments.length > 0 &&
                    assignments.map(({ id: gradeId }) => (
                      <TableCell key={gradeId} align="center">
                        {studentGrades?.[gradeId]?.value || "-"}
                      </TableCell>
                    ))}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Container>
  );
}
