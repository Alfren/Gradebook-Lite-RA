import { useEffect, useState } from "react";
import {
  Box,
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
import {
  Description,
  Groups,
  Refresh,
  East,
  Add,
  Addchart,
  Class,
} from "@mui/icons-material";
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
  const {
    data: classes,
    refetch,
    isFetching,
  } = useGetTeacherClassesQuery(teacherId, {
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

  const [newClassOpen, setNewClassOpen] = useState(false);

  const [currentClass, setCurrentClass] = useState({});
  const [classSelectValue, setClassSelectValue] = useState("");

  const [dataRows, setDataRows] = useState([]);
  const [dataColumns, setDataColumns] = useState([]);

  useEffect(() => {
    if (classSelectValue && !isFetching) {
      setCurrentClass(classes.find(({ title }) => title === classSelectValue));
    }
    if (currentClass?.students?.length > 0 && !isFetching) {
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
        { field: "name", headerName: "Student", flex: 1, minWidth: 150 },
        ...currentClass?.assignments.map(({ title, type }) => ({
          field: title,
          headerAlign: "center",
          align: "center",
          flex: 1,
          minWidth: 100,
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
          width: 50,
          renderCell: ({ row }) => (
            <Button
              onClick={() => {
                setEditRow(row);
                setEditOpen(true);
              }}
            >
              <East />
            </Button>
          ),
        },
      ];
      setDataColumns(cols);
    } else {
      setDataColumns([{ field: "name", headerName: "Student", flex: 1 }]);
    }
  }, [currentClass, isFetching]);

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
        classId={currentClass.id}
      />
      <AssignmentModal
        assignments={currentClass?.assignments || []}
        open={assignmentModal}
        toggle={toggleAssignmentModal}
        classId={currentClass.id}
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
        flexWrap="wrap"
        mb={2}
      >
        <Box flex={1} maxWidth="100%">
          <TextField
            label="Select Class"
            value={classSelectValue}
            size="small"
            onChange={changeClass}
            select
            sx={{ minWidth: 150, maxWidth: "inherit" }}
            disabled={classes === undefined || classes?.length === 0}
          >
            {classes?.map((entry) => (
              <MenuItem key={entry.id} value={entry.title}>
                {entry.title}
              </MenuItem>
            )) || <MenuItem value="" />}
          </TextField>
        </Box>
        <Stack
          direction="row"
          columnGap={1}
          flex={1}
          justifyContent="flex-end"
          mx="auto"
        >
          <Tooltip title="Manage classes" arrow disableInteractive>
            <IconButton color="primary" onClick={() => setNewClassOpen(true)}>
              <Class />
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage class assignments" arrow disableInteractive>
            <IconButton color="primary" onClick={toggleAssignmentModal}>
              <Description />
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage class students" arrow disableInteractive>
            <IconButton color="primary" onClick={toggleStudentModal}>
              <Groups />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refetch data" arrow disableInteractive>
            <span>
              <IconButton
                onClick={refetchData}
                color="primary"
                disabled={isFetching}
              >
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      <DataGrid
        rows={dataRows || []}
        columns={dataColumns}
        density="compact"
        autoHeight
        loading={isFetching}
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
