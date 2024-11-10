import React, { useState } from "react";
import {
  Alert,
  Box,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Tooltip,
  Stepper,
  Step,
  StepButton,
} from "@mui/material";
import CloseButton from "./CloseButton";
import {
  useDeleteClassMutation,
  useCreateAssignmentGroupMutation,
  useUpdateAssignmentGroupMutation,
  useCreateClassMutation,
  useUpdateClassMutation,
} from "../store/rtk";
import { Delete, Edit, Save } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ConfirmDialog from "./ConfirmDialog";
import { useSelector } from "react-redux";

export default function ClassModal({ open, toggle, classes }) {
  const { enqueueSnackbar: msg } = useSnackbar();

  const { id: teacherId } = useSelector((state) => state.user);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const [createClass, { isLoading }] = useCreateClassMutation();
  const [updateClass, { isLoading: updateIsLoading }] =
    useUpdateClassMutation();
  const [createAssignmentGroup, { isLoading: createGroupIsLoading }] =
    useCreateAssignmentGroupMutation();
  const [updateAssignmentGroup, { isLoading: updateGroupIsLoading }] =
    useUpdateAssignmentGroupMutation();

  const steps = ["Class", "Groups", "Assignments", "Students"];

  const [activeStep, setActiveStep] = useState(0);
  const [classInfo, setClassInfo] = useState({ title: "" });
  const [groupInfo, setGroupInfo] = useState({ name: "", description: "" });
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [students, setStudents] = useState([]);
  const [removeClass, { isLoading: deleteIsLoading }] =
    useDeleteClassMutation();

  const deleteClass = (id) => {
    removeClass({ id, teacherId })
      .then(({ error }) => {
        if (error) throw new Error(error.message);
        msg("Class deleted!", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        msg("Operation failed", { variant: "error" });
      });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreateClass = async () => {
    try {
      const newClass = await createClass({
        title: classInfo.title,
        teacherId,
      }).unwrap();
      if (newClass.error) throw new Error(newClass.error.message);
      setClassInfo(newClass);
      setActiveStep(1);
      msg("Class created!", { variant: "success" });
    } catch (error) {
      msg("Failed to create class", { variant: "error" });
    }
  };

  const handleClassUpdate = async () => {
    try {
      const updatedClass = await updateClass({
        id: classInfo.id,
        title: classInfo.title,
      });
      if (updatedClass.error) throw new Error(updatedClass.error.message);
      msg("Class updated!", { variant: "success" });
    } catch (error) {
      msg("Failed to update class", { variant: "error" });
    }
  };

  const handleAddGroup = async () => {
    const newGroup = await createAssignmentGroup({
      ...groupInfo,
      classId: classInfo.id,
    });
  };

  const handleUpdateGroup = async () => {
    const updatedGroup = await updateAssignmentGroup({
      ...groupInfo,
      id: groupInfo.id,
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={toggle}>
      <ConfirmDialog
        open={confirmOpen}
        toggle={() => setConfirmOpen(!confirmOpen)}
        data={confirmData}
      />
      <CloseButton action={toggle} placement="left" />
      <Typography variant="h5" align="center" pt={2}>
        Manage Classes
      </Typography>
      {classes?.length > 0 && (
        <Divider sx={{ mx: 2, mt: 1 }}>Existing Classes</Divider>
      )}
      <Stack sx={{ p: 1 }}>
        {classes?.length > 0 ? (
          classes?.map((cls) => {
            const { id, title, students, groupAssignments } = cls;
            return (
              <Stack
                key={id}
                component={Paper}
                direction="row"
                alignItems="center"
                sx={{ my: 0.5, py: 0.5, px: 2 }}
              >
                <Stack flex={1}>
                  <Typography flex={1}>{title}</Typography>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption">
                      <Typography component="span" color="text.secondary">
                        Students:{" "}
                      </Typography>
                      {students?.length}
                    </Typography>
                    <Typography variant="caption">
                      <Typography component="span" color="text.secondary">
                        Assignments:{" "}
                      </Typography>
                      {assignments?.length}
                    </Typography>
                  </Stack>
                </Stack>
                <Box ml={3}>
                  {/* Edit class */}
                  <Tooltip title="Edit class">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        setClassInfo(cls);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete class">
                    <IconButton
                      color="error"
                      size="small"
                      disabled={deleteIsLoading}
                      onClick={() => {
                        setConfirmData({
                          title: "Remove class",
                          description: `Delete ${title} and all records?`,
                          actions: [
                            {
                              action: () => deleteClass(id),
                              color: "error",
                              label: "DELETE",
                            },
                          ],
                        });
                        setConfirmOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            );
          })
        ) : (
          <Alert severity="info" pt={2}>
            Create your first class!
          </Alert>
        )}
      </Stack>
      <Divider sx={{ mx: 2, mt: 1 }}>New Class</Divider>
      <Stack spacing={1} mx={2}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 1 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => setActiveStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box p={2} minWidth={{ xs: "100vw", md: 600 }}>
          {activeStep === 0 && (
            <Stack spacing={1}>
              <Typography variant="h6">Create Class</Typography>
              <TextField
                label="Class Title"
                value={classInfo.title}
                onChange={(e) =>
                  setClassInfo({ ...classInfo, title: e.target.value })
                }
                fullWidth
                disabled={updateIsLoading || isLoading}
                slotProps={{
                  input: {
                    endAdornment: classInfo.id && (
                      <Tooltip title="Save class title">
                        <Button
                          onClick={handleClassUpdate}
                          color="success"
                          variant="text"
                          sx={{ minWidth: 0 }}
                          disabled={
                            !classInfo.title || updateIsLoading || isLoading
                          }
                        >
                          <Save />
                        </Button>
                      </Tooltip>
                    ),
                  },
                }}
              />
            </Stack>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6">Create Groups</Typography>
              {/* Add UI for creating groups */}
              <Stack spacing={1}>
                <TextField
                  label="Group Name"
                  value={groupInfo.name}
                  onChange={(e) =>
                    setGroupInfo({ ...groupInfo, name: e.target.value })
                  }
                  fullWidth
                  disabled={updateIsLoading || isLoading}
                />
                <TextField
                  label="Description"
                  value={groupInfo.description}
                  onChange={(e) =>
                    setGroupInfo({ ...groupInfo, description: e.target.value })
                  }
                  fullWidth
                  disabled={updateIsLoading || isLoading}
                />
                <Button
                  variant="contained"
                  onClick={handleAddGroup}
                  disabled={!groupInfo.name || updateIsLoading || isLoading}
                >
                  Add Group
                </Button>
              </Stack>
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6">Create Assignments</Typography>
              {/* Add UI for creating assignments within groups */}
            </Box>
          )}
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6">Add Students</Typography>
              {/* Add UI for adding students to the class */}
            </Box>
          )}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === 0 && !classInfo?.id ? (
              <Button variant="contained" onClick={handleCreateClass}>
                Create Class
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}
