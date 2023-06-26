import { useRef, useState } from "react";
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
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Add, Close } from "@mui/icons-material";

const steps = ["Class Name", "Assignments", "Students"];

export default function NewClassStepper() {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");

  const assignmentRef = useRef();
  const [assignmentName, setAssignmentName] = useState("");
  const [assignments, setAssignments] = useState([]);
  const addAssignment = () => {
    setAssignments([...assignments, assignmentName]);
    setAssignmentName("");
    assignmentRef.current.focus();
  };
  const removeAssignment = (i) => {
    let arr = [...assignments];
    arr.splice(i, 1);
    setAssignments(arr);
  };

  const studentRef = useRef();
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);
  const addStudent = () => {
    setStudents([...students, studentName]);
    setStudentName("");
  };
  const removeStudent = (i) => {
    let arr = [...students];
    arr.splice(i, 1);
    setStudents(arr);
  };

  const [postClass, { isLoading }] = useCreateClassMutation();

  const createClass = () => {
    postClass({ title, teacherId })
      .then(({ error }) => {
        if (error) throw new Error(error.message);
        toggle();
        setTitle("");
        msg("Class created!", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Operation failed", { variant: "error" });
      });
  };

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleStep = (step) => setActiveStep(step);

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <>
      <Stepper nonLinear activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step
            key={label}
            // completed={completed[index]}
            sx={{
              mx: 3,
              "* svg": {
                fill: activeStep === index ? blue[500] : blue[100],
              },
            }}
          >
            <StepButton onClick={() => handleStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <Collapse in={activeStep === 0}>
        <Box component={Paper} mx={1} p={1}>
          <Typography>New Class</Typography>
          <Stack spacing={1} p={1} m={1}>
            <Stack direction="row">
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
                <Typography key={i}>
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
                  {entry}
                </Typography>
              ))}
            </Stack>
          )}
          <Stack spacing={1} p={1} m={1} direction="row">
            <TextField
              label="Assignment Title"
              size="small"
              fullWidth
              required
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              onKeyDown={(e) => {
                if (assignmentName !== "" && e.key === "Enter") addAssignment();
              }}
              inputRef={assignmentRef}
            />
            <Button
              variant="contained"
              disabled={assignmentName === ""}
              color="success"
              onClick={addAssignment}
            >
              <Add />
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
          <Stack spacing={1} p={1} m={1} direction="row">
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
      <Stack direction="row" m={4} mb={2}>
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
          <Button onClick={() => {}}>Create Class</Button>
        )}
      </Stack>
    </>
  );
}
