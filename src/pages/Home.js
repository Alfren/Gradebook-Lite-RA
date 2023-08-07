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
  Typography,
} from "@mui/material";
import { useGetTeacherClassesQuery } from "../store/rtk";
import { Description, Groups, Refresh, East, Class } from "@mui/icons-material";
import StudentsModal from "../components/StudentsModal";
import { useSnackbar } from "notistack";
import AssignmentModal from "../components/AssignmentModal";
import StudentGradeDrawer from "../components/StudentGradeDrawer";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import ClassModal from "../components/ClassModal";

export default function Home() {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const {
    data: classes = [],
    refetch,
    isFetching,
  } = useGetTeacherClassesQuery(teacherId, {
    skip: !teacherId,
  });

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

  const dataGridReload = (selectedClassTitle) => {
    const TITLE = selectedClassTitle || classSelectValue;
    let FOUND = {};
    if (TITLE && !isFetching && classes.length > 0) {
      FOUND = classes.find(({ title }) => title === TITLE);
      if (FOUND) setCurrentClass(FOUND);
    } else if (TITLE == "" && !isFetching && classes.length > 0) {
      setClassSelectValue(classes[0]?.title);
      setCurrentClass(classes[0]);
    } else if (classes.length === 0) {
      setClassSelectValue("");
      setCurrentClass({});
      setDataRows([]);
    }

    if (FOUND?.students?.length > 0 && !isFetching) {
      let arr = FOUND?.students?.map((entry) => {
        let temp = { ...entry };
        Object.entries(entry.grades).forEach(([key, val]) => {
          const assign = FOUND.assignments.find(
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

    const totalGradeValue = ({ row }) => {
      let total = 0,
        count = 0;
      FOUND?.assignments.forEach((val) => {
        if (row[val.title] !== undefined) {
          if (typeof row[val.title] === "object") {
            total = total + row[val.title].TOTAL;
          } else {
            total = total + row[val.title];
          }
          count++;
        }
      });
      const result = total / count;
      return isNaN(result) ? "" : result.toFixed(2);
    };

    if (FOUND?.assignments?.length > 0) {
      const cols = [
        { field: "name", headerName: "Student", minWidth: 150, maxWidth: 250 },
        ...FOUND?.assignments.map(({ title, type }) => ({
          field: title,
          headerAlign: "center",
          align: "center",
          flex: 1,
          gradeType: type,
          valueGetter: ({ value, colDef }) =>
            Number(colDef?.gradeType === "Rubric" ? value?.TOTAL : value) ||
            null,
          type: "number",
        })),
        {
          field: "TOTAL",
          headerName: "Final Grade",
          align: "center",
          minWidth: 100,
          sx: { width: "auto" },
          type: "number",
          valueGetter: totalGradeValue,
          renderCell: totalGradeValue,
        },
        {
          field: "options",
          headerName: " ",
          align: "center",
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          width: 50,
          sx: { "@media print": { display: "none !important" } },
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
  };

  useEffect(() => {
    if (!isFetching) dataGridReload();
  }, [isFetching, classSelectValue]);

  const changeClass = (e) => {
    const val = e.target.value;
    const obj = classes.find(({ title }) => title === val);
    if (obj.id) {
      setCurrentClass(obj);
      setClassSelectValue(obj.title);
      setTimeout(() => dataGridReload(obj.title), 200);
    }
  };

  const refetchData = () => {
    refetch()
      .then(({ error }) => {
        if (error) throw new Error(error);
        dataGridReload();
        msg("Data refreshed.", { variant: "success" });
      })
      .catch((error) => console.error(error));
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
        <GridToolbar
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
          }}
        />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
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
      <ClassModal
        open={newClassOpen}
        toggle={() => setNewClassOpen(!newClassOpen)}
        classes={classes}
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
            label="Class Select"
            value={classSelectValue || ""}
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
            <span>
              <IconButton
                color="primary"
                onClick={toggleAssignmentModal}
                disabled={classes.length === 0 || !currentClass}
              >
                <Description />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Manage class students" arrow disableInteractive>
            <span>
              <IconButton
                color="primary"
                onClick={toggleStudentModal}
                disabled={classes.length === 0 || !currentClass}
              >
                <Groups />
              </IconButton>
            </span>
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
        sx={{ "@media print": { "*": { width: "fit-content" } } }}
        getRowClassName={({ row }) => {
          let total = 0,
            count = 0;
          Object.values(row.grades).forEach((val) => {
            if (typeof val === "object") {
              total = total + val.TOTAL;
            } else {
              total = total + val;
            }
            count++;
          });
          total = total / count;
          return total <= 6 ? "failing-grade-highlight" : "";
        }}
        loading={isFetching}
        showCellVerticalBorder
        disableRowSelectionOnClick
        disableColumnSelector
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {classes.length > 0 && classSelectValue !== "" ? (
                "No students to display for the selected class"
              ) : classes.length === 0 && classSelectValue === "" ? (
                <Stack className="noPrint">
                  <Typography>Create your first class!</Typography>
                  <Button
                    onClick={() => setNewClassOpen(!newClassOpen)}
                    variant="contained"
                    size="small"
                    color="warning"
                  >
                    Create Class
                  </Button>
                </Stack>
              ) : (
                "Select a class to begin"
              )}
            </Stack>
          ),
        }}
      />
    </Container>
  );
}
