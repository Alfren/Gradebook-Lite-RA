import { useState } from "react";
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
} from "@mui/material";

const steps = ["Class Name", "Assignments", "Students"];

export default function NewClassStepper() {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");

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
          <Step key={label} completed={completed[index]} sx={{ mx: 3 }}>
            <StepButton color="inherit" onClick={() => handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Collapse in={activeStep === 0}>
        <Stack spacing={1} p={1} m={1} component={Paper}>
          <Typography>New Class</Typography>
          <Stack direction="row" columnGap={1}>
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
      </Collapse>
      <Collapse in={activeStep === 1}>
        <Stack spacing={1} p={1} m={1} component={Paper}>
          <Typography>Assignments</Typography>
          <TextField label="Assignment Title" size="small" fullWidth required />
        </Stack>
      </Collapse>
      <Collapse in={activeStep === 2}>
        <Stack spacing={1} p={1} m={1} component={Paper}>
          <Typography>Students</Typography>
          <TextField label="Student Name" size="small" fullWidth required />
        </Stack>
      </Collapse>
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
          <Button onClick={() => {}}>Create Class</Button>
        )}
      </Stack>
    </>
  );
}
