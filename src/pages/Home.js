import { useState } from "react";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  useGetAssignmentsQuery,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../store/rtk";
import {
  Description,
  OpenInNew,
  Groups,
  Refresh,
  East,
} from "@mui/icons-material";
import StudentsModal from "../components/StudentsModal";
import { useSnackbar } from "notistack";
import AssignmentModal from "../components/AssignmentModal";
import StudentGradeDrawer from "../components/StudentGradeDrawer";
import { DataGrid } from "@mui/x-data-grid";

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

  const [patchStudent] = useUpdateStudentMutation();

  const refetchData = () => {
    refetchStudents();
    refetchAssignments();
    msg("It worked. Data refreshed.", { variant: "success" });
  };
  const [studentModal, setStudentModal] = useState(false);
  const toggleStudentModal = () => setStudentModal(!studentModal);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const toggleAssignmentModal = () => setAssignmentModal(!assignmentModal);

  const [editRow, setEditRow] = useState({});
  const [editOpen, setEditOpen] = useState(false);

  const dataRows = students.map((entry) => {
    let temp = { ...entry };
    Object.entries(entry.grades).forEach(([key, val]) => {
      const assign = assignments.find(({ id }) => key == id);
      temp[assign?.title] = val;
    });
    return temp;
  });

  const dataColumns = [
    { field: "name", headerName: "Student", flex: 1 },
    ...assignments.map(({ title, type }) => ({
      field: title,
      headerAlign: "center",
      align: "center",
      flex: 1,
      gradeType: type,
      valueGetter: ({ value, colDef }) =>
        Number(colDef?.gradeType === "Multiple" ? value?.TOTAL : value) || null,
      type: "number",
    })),
    {
      field: "TOTAL",
      headerName: "Final Grade",
      align: "center",
      valueGetter: ({ row }) => {
        let total = 0;
        assignments.forEach((val) => {
          if (row[val.title] !== undefined) {
            if (typeof row[val.title] === "object") {
              total = total + row[val.title].TOTAL;
            } else {
              total = total + row[val.title];
            }
          }
        });
        return total.toFixed(2);
      },
    },
    {
      field: "options",
      headerName: " ",
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <IconButton
          onClick={() => {
            setEditRow(row);
            setEditOpen(true);
          }}
        >
          <East />
        </IconButton>
      ),
    },
  ];

  const handleRowUpdate = (id, updates, grades) => {
    let body = { grades: { ...grades } };
    Object.entries(updates).forEach(([key, val]) => {
      body.grades[assignments.find((el) => el.title === key).id] = val;
    });
    patchStudent({ id, body })
      .then((resp) => {
        msg("Changes saved.", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Failed to save changes.", { variant: "error" });
      });
  };

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
      <StudentGradeDrawer
        open={editOpen}
        toggle={() => setEditOpen(!editOpen)}
        row={editRow}
        setRow={setEditRow}
        assignments={assignments}
      />
      <Stack
        direction="row"
        columnGap={1}
        justifyContent="space-between"
        mb={2}
      >
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
        <Stack direction="row" columnGap={2}>
          <Button
            variant="outlined"
            endIcon={<Description />}
            onClick={toggleAssignmentModal}
          >
            Assignments
          </Button>
          <Button
            variant="outlined"
            endIcon={<Groups />}
            onClick={toggleStudentModal}
          >
            Students
          </Button>
        </Stack>
      </Stack>
      <DataGrid
        rows={dataRows || []}
        columns={dataColumns}
        density="compact"
        // editMode="row"
        processRowUpdate={(updatedRow, originalRow) => {
          let updates = {};
          const NEW = Object.entries(updatedRow);
          NEW.forEach(([key, val]) => {
            if (val !== originalRow[key] && val !== null) {
              updates[key] = val;
            }
          });
          handleRowUpdate(originalRow.id, updates, originalRow.grades);
          return updatedRow;
        }}
        onProcessRowUpdateError={(error) => console.error(error)}
        showCellVerticalBorder
      />
    </Container>
  );
}
