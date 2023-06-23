import { useEffect, useState } from "react";
import {
  Button,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useGetTeacherClassesQuery } from "../store/rtk";
import { Description, Groups, Refresh, East, Add } from "@mui/icons-material";
import StudentsModal from "../components/StudentsModal";
import { useSnackbar } from "notistack";
import AssignmentModal from "../components/AssignmentModal";
import StudentGradeDrawer from "../components/StudentGradeDrawer";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import NewClassModal from "../components/NewClassModal";

export default function Home() {
  const { closeSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const { data: classes, refetch } = useGetTeacherClassesQuery(teacherId, {
    skip: !teacherId,
  });

  const refetchData = () => {
    refetch();
    msg("It worked. Data refreshed.", { variant: "success" });
  };

  const [studentModal, setStudentModal] = useState(false);
  const toggleStudentModal = () => setStudentModal(!studentModal);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const toggleAssignmentModal = () => setAssignmentModal(!assignmentModal);

  const [editRow, setEditRow] = useState({});
  const [editOpen, setEditOpen] = useState(false);

  const [newClassOpen, setNewClassOpen] = useState(true);

  const [currentClass, setCurrentClass] = useState({});
  const [classSelectValue, setClassSelectValue] = useState("");

  const [dataRows, setDataRows] = useState([]);
  const [dataColumns, setDataColumns] = useState([]);

  useEffect(() => {
    if (currentClass?.students?.length > 0) {
      let arr = currentClass?.students?.map((entry) => {
        let temp = { ...entry };
        Object.entries(entry.grades).forEach(([key, val]) => {
          const assign = currentClass.assignments.find(
            ({ id }) => key.toString() === id.toString()
          );
          temp[assign?.title] = val;
        });
        return temp;
      });
      setDataRows(arr);
    } else {
      setDataRows([]);
    }

    if (currentClass?.assignments?.length > 0) {
      const cols = [
        { field: "name", headerName: "Student", flex: 1 },
        ...currentClass?.assignments.map(({ title, type }) => ({
          field: title,
          headerAlign: "center",
          align: "center",
          flex: 1,
          gradeType: type,
          valueGetter: ({ value, colDef }) =>
            Number(colDef?.gradeType === "Multiple" ? value?.TOTAL : value) ||
            null,
          type: "number",
        })),
        {
          field: "TOTAL",
          headerName: "Final Grade",
          align: "center",
          valueGetter: ({ row }) => {
            let total = 0;
            currentClass?.assignments.forEach((val) => {
              if (row[val.title] !== undefined) {
                if (typeof row[val.title] === "object") {
                  total = total + row[val.title].TOTAL;
                } else {
                  total = total + row[val.title];
                }
              }
            });
            const result = total / currentClass?.assignments.length;
            return isNaN(result) ? "" : total.toFixed(2);
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
      setDataColumns(cols);
    } else {
      setDataColumns([{ field: "name", headerName: "Student", flex: 1 }]);
    }
  }, [currentClass]);

  const changeClass = (e) => {
    const val = e.target.value;
    const obj = classes.find(({ title }) => title === val);
    if (obj.id) {
      setCurrentClass(obj);
      setClassSelectValue(obj.title);
    }
  };

  return (
    <Container component={Paper} sx={{ p: 2 }}>
      <StudentsModal
        students={currentClass?.students || []}
        open={studentModal}
        toggle={toggleStudentModal}
      />
      <AssignmentModal
        assignments={currentClass?.assignments || []}
        open={assignmentModal}
        toggle={toggleAssignmentModal}
      />
      <StudentGradeDrawer
        open={editOpen}
        toggle={() => setEditOpen(!editOpen)}
        row={editRow}
        setRow={setEditRow}
        assignments={currentClass?.assignments || []}
      />
      <NewClassModal
        open={newClassOpen}
        toggle={() => setNewClassOpen(!newClassOpen)}
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
              // disabled={studentsFetching || assignmentsFetching}
            >
              <Refresh />
            </IconButton>
          </span>
        </Tooltip>
        {classes?.length > 0 && (
          <TextField
            label="Select Class"
            value={classSelectValue}
            size="small"
            onChange={changeClass}
            select
            sx={{ minWidth: 150, width: "fit-content" }}
          >
            {classes.map((entry) => (
              <MenuItem key={entry.id} value={entry.title}>
                {entry.title}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Stack direction="row" columnGap={2}>
          <Button
            variant="contained"
            color="success"
            endIcon={<Add />}
            onClick={() => setNewClassOpen(true)}
          >
            Add Class
          </Button>
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
        autoHeight
        // loading={studentsFetching || assignmentsFetching}
        showCellVerticalBorder
        disableRowSelectionOnClick
        disableColumnSelector
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
      />
    </Container>
  );
}
