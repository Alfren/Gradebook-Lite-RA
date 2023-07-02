import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useCreateClassMutation } from "../store/rtk";
import {
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
  TextField,
  Button,
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Add, Close } from "@mui/icons-material";

const steps = ["Provide Class Name", "Develop Assignments", "Add Students"];

export default function NewClassStepper({ toggle }) {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const [postClass, { isLoading }] = useCreateClassMutation();

  const createClass = () => {
    postClass({ title, teacherId, students, assignments })
      .then(({ error }) => {
        if (error) throw new Error(error.message);
        toggle();
        setTitle("");
        msg("Class created!", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Class creation failed", { variant: "error" });
      });
  };

  const [title, setTitle] = useState("");

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [assignmentName, setAssignmentName] = useState("");
  const [assignments, setAssignments] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);

  const assignmentRef = useRef();
  const partsRef = useRef();
  const studentRef = useRef();

  const addAssignment = () => {
    let temp = { title: assignmentName, type };
    if (type === "Multiple") temp.parts = parts;
    setAssignments([...assignments, temp]);
    setAssignmentName("");
    setParts([]);
    setNewPartTitle("");
    assignmentRef.current.focus();
  };

  const removeAssignment = (i) => {
    let arr = [...assignments];
    arr.splice(i, 1);
    setAssignments(arr);
  };

  const addStudent = () => {
    setStudents([...students, studentName]);
    setStudentName("");
  };

  const removeStudent = (i) => {
    let arr = [...students];
    arr.splice(i, 1);
    setStudents(arr);
  };

  const [type, setType] = useState("Single");

  const [newPartTitle, setNewPartTitle] = useState("");
  const [parts, setParts] = useState([]);
  const [chipList, setChipList] = useState([]);

  const handleAddPart = () => {
    setParts([...parts, newPartTitle]);
    setNewPartTitle("");
    partsRef.current.focus();
  };

  useEffect(() => {
    if (assignments.length === 0) return;
    let list = [];
    assignments.forEach(({ parts: entry }) => {
      if (entry && entry.length > 0) {
        entry.forEach((part) => {
          if (!list.includes(part) && !parts.includes(part)) list.push(part);
        });
      }
    });
    setChipList(list);
  }, [assignments, parts]);

  const handleNext = () => {
    const newActiveStep =
      activeStep === steps.length - 1 &&
      !Object.keys(completed).length === steps.length
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  return (
    <>
      <Stepper nonLinear activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step
            key={index}
            sx={{
              mx: 3,
              "* svg": {
                fill: activeStep === index ? blue[500] : blue[100],
              },
            }}
          >
            <StepButton onClick={() => setActiveStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box>
        <Collapse in={activeStep === 0}>
          <Box component={Paper} mx={1} p={1}>
            <Typography>New Class</Typography>
            <Stack spacing={1} p={1} m={1}>
              <Stack direction="row" alignItems="center">
                <TextField
                  label="Class Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  size="small"
                  fullWidth
                  required
                />
              </Stack>
            </Stack>
          </Box>
        </Collapse>
        <Collapse in={activeStep === 1}>
          <Box component={Paper} m={1} p={1}>
            <Typography>Assignments</Typography>
            {assignments.length > 0 && (
              <Stack p={1} m={1}>
                {assignments.map((entry, i) => (
                  <Box key={i}>
                    <Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeAssignment(i)}
                      >
                        <Close />
                      </IconButton>
                      <Typography color="text.secondary" component="span">
                        {i + 1}.
                      </Typography>{" "}
                      {entry.title}
                    </Typography>
                    {entry?.parts && (
                      <Typography color="text.secondary" ml={7}>
                        {entry.parts.map(
                          (item, t) =>
                            `${item}${entry.parts.length - 1 === t ? "" : ", "}`
                        )}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
            <Stack spacing={2} component={Paper} p={1}>
              <Divider>
                <Typography variant="h6" align="center">
                  New Assignment
                </Typography>
              </Divider>
              <Stack direction="row" spacing={1}>
                <TextField
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                  size="small"
                  fullWidth
                  select
                  sx={{ minWidth: 150 }}
                  helperText={
                    type === "Single"
                      ? "Type 'Single' has only 1 grade"
                      : "Type 'Multiple' can have sub-grades"
                  }
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Multiple">Multiple</MenuItem>
                </TextField>
                <TextField
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  label="Title"
                  size="small"
                  placeholder="Assignment title"
                  fullWidth
                  autoComplete="off"
                  inputRef={assignmentRef}
                />
              </Stack>
              {type === "Multiple" && (
                <>
                  {chipList.length > 0 && (
                    <Paper elevation={6} sx={{ p: 1 }}>
                      <Typography variant="body2" pb={1}>
                        Category Suggestions
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {chipList.map((val, i) => (
                          <Chip
                            key={i}
                            label={val}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setChipList(chipList.filter((el) => el !== val));
                              setParts([...parts, val]);
                            }}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  )}
                  <Stack direction="row" spacing={2}>
                    <TextField
                      value={newPartTitle}
                      onChange={(e) => setNewPartTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          newPartTitle !== "" &&
                          !parts.includes(newPartTitle)
                        )
                          handleAddPart();
                      }}
                      label="Assignment Category Title"
                      size="small"
                      inputRef={partsRef}
                      fullWidth
                    />
                    <Button
                      onClick={handleAddPart}
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={
                        newPartTitle === "" || parts.includes(newPartTitle)
                      }
                    >
                      <Add />
                    </Button>
                  </Stack>
                  {type === "Multiple" && (
                    <Box component={Paper} elevation={4} p={1}>
                      <Typography color="text.secondary">
                        Add assignment categories{" "}
                        {parts.length > 0 && (
                          <Button
                            onClick={() => setParts([])}
                            size="small"
                            sx={{ float: "right" }}
                          >
                            clear
                          </Button>
                        )}
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.75}>
                        {parts.map((title, i) => (
                          <Chip
                            key={i}
                            label={title}
                            onDelete={() =>
                              setParts([...parts.filter((el) => el !== title)])
                            }
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={addAssignment}
                disabled={
                  assignmentName === "" ||
                  (type === "Multiple" && parts.length === 0)
                }
                endIcon={<Add />}
              >
                Create Assignment
              </Button>
            </Stack>
          </Box>
        </Collapse>
        <Collapse in={activeStep === 2}>
          <Box component={Paper} m={1} p={1}>
            <Typography>Students</Typography>
            {students.length > 0 && (
              <Stack p={1} m={1}>
                {students.map((entry, i) => (
                  <Typography key={i}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeStudent(i)}
                    >
                      <Close />
                    </IconButton>
                    <Typography color="text.secondary" component="span">
                      {i + 1}.
                    </Typography>{" "}
                    {entry}
                  </Typography>
                ))}
              </Stack>
            )}
            <Stack spacing={1} p={1} m={1} direction="row" alignItems="center">
              <TextField
                label="Student Name"
                size="small"
                fullWidth
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyDown={(e) => {
                  if (studentName !== "" && e.key === "Enter") addStudent();
                }}
                inputRef={studentRef}
              />
              <Button
                variant="contained"
                disabled={studentName === ""}
                color="success"
                onClick={addStudent}
              >
                <Add />
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </Box>
      <Stack direction="row" mx={4} mb={2}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box flex={1} />
        {activeStep !== steps.length - 1 ? (
          <Button onClick={handleComplete}>Next</Button>
        ) : (
          <Button onClick={createClass} color="success">
            Create Class
          </Button>
        )}
      </Stack>
    </>
  );
}
