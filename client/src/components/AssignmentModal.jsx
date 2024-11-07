import { useEffect, useState, useRef } from "react";
import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Delete, SaveRounded } from "@mui/icons-material";
import {
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
} from "../store/rtk";
import ConfirmDialog from "./ConfirmDialog";
import CloseButton from "./CloseButton";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

export default function AssignmentModal({
  assignments,
  open,
  toggle,
  classId,
}) {
  const { enqueueSnackbar: msg } = useSnackbar();
  const { id: teacherId } = useSelector((state) => state.user);
  const [postAssignment, { isLoading: postLoading }] =
    useCreateAssignmentMutation();
  const [deleteAssignment, { isLoading: deleteLoading }] =
    useDeleteAssignmentMutation();
  const [patchAssignment, { isLoading: patchLoading }] =
    useUpdateAssignmentMutation();
  const [assignment, setAssignment] = useState("");
  const [type, setType] = useState("Single");

  const [newPartTitle, setNewPartTitle] = useState("");
  const [parts, setParts] = useState([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const [editId, setEditId] = useState(null);
  const loading = postLoading || deleteLoading || patchLoading;

  const resetForm = () => {
    setAssignment("");
    setParts([]);
    setNewPartTitle("");
    setEditId(null);
  };

  const createAssignment = () => {
    let body = { title: assignment, type, teacherId, classId };
    if (type === "Rubric") body.parts = parts;
    postAssignment(body)
      .then(({ error }) => {
        if (error) throw new Error(error);
        resetForm();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateAssignment = () => {
    let body = { title: assignment, type, teacherId, classId, id: editId };
    if (type === "Rubric") body.parts = parts;
    patchAssignment(body)
      .then(({ error }) => {
        if (error) throw new Error(error);
        msg("Assignment updated!", { variant: "success" });
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        msg("Assignment updated failed!", { variant: "error" });
      });
  };

  const [chipList, setChipList] = useState([]);
  useEffect(() => {
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

  const partInputRef = useRef();

  const handleAddPart = () => {
    setParts([...parts, newPartTitle]);
    setNewPartTitle("");
    partInputRef.current.focus();
  };

  const handleEdit = ({ id, title, type, parts }) => {
    setEditId(id);
    setAssignment(title);
    setType(type);
    if (type === "Rubric") setParts(parts);
  };

  return (
    <Dialog open={open} onClose={toggle} maxWidth="md">
      <Backdrop open={loading} sx={{ zIndex: 99 }}>
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
          <Typography>Processing...</Typography>
        </Stack>
      </Backdrop>
      <ConfirmDialog
        open={confirmOpen}
        toggle={() => setConfirmOpen(!confirmOpen)}
        data={confirmData}
      />
      <CloseButton action={toggle} />
      <Typography variant="h5" px={4} pt={2} align="center">
        ASSIGNMENTS
      </Typography>
      <Stack columnGap={2} m={2} direction="row">
        <Stack
          spacing={2}
          sx={{
            minWidth: 300,
            backgroundColor: editId ? "#b332" : "default",
          }}
          component={Paper}
          p={1}
        >
          <Divider>
            <Typography variant="h6" align="center">
              {editId ? "Edit" : "New"} Assignment
            </Typography>
          </Divider>
          <TextField
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            label="Title"
            size="small"
            placeholder="Assignment title"
            fullWidth
            autoComplete="off"
          />
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
                : "Type 'Rubric' can have sub-grades"
            }
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Rubric">Rubric</MenuItem>
          </TextField>
          <Collapse
            in={type === "Rubric"}
            timeout={300}
            easing={{ enter: "yes" }}
          >
            <Collapse in={chipList.length > 0} easing={{ enter: "yes" }}>
              <Paper elevation={6} sx={{ p: 1 }}>
                <Typography variant="body2" pb={1}>
                  Category Suggestions
                </Typography>
                <Stack direction="row" spacing={1}>
                  {chipList.map((val) => (
                    <Chip
                      label={val}
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setChipList(chipList.filter((el) => el !== val));
                        setParts([...parts, val]);
                      }}
                      key={val}
                    />
                  ))}
                </Stack>
              </Paper>
            </Collapse>
            <Stack direction="row" spacing={2} my={1}>
              <TextField
                value={newPartTitle}
                onChange={(e) => setNewPartTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPartTitle !== "") handleAddPart();
                }}
                label="Assignment Category Title"
                size="small"
                inputRef={partInputRef}
              />
              <Button
                onClick={handleAddPart}
                variant="contained"
                color="success"
                size="small"
                disabled={newPartTitle === "" || parts.includes(newPartTitle)}
              >
                <Add />
              </Button>
            </Stack>
            <List dense component={Paper}>
              {parts.length === 0 && (
                <ListItem>
                  <ListItemText align="center">
                    <Typography color="text.secondary">
                      Add assignment categories
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}
              {parts.map((title, i) => {
                return (
                  <ListItem
                    key={i}
                    sx={{ ":hover": { background: "#44444480" } }}
                  >
                    <ListItemText sx={{ flex: 1 }}>
                      <Typography component="span" color="text.secondary">
                        {i + 1}.{" "}
                      </Typography>
                      {title}
                    </ListItemText>
                    <IconButton
                      color="error"
                      tabIndex={-1}
                      onClick={() =>
                        setParts([...parts.filter((el) => el !== title)])
                      }
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
          {editId ? (
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="contained"
                color="success"
                onClick={updateAssignment}
                disabled={
                  assignment === "" || (type === "Rubric" && parts.length === 0)
                }
                endIcon={<SaveRounded />}
              >
                Save Changes
              </Button>
              <Button color="warning" onClick={resetForm} tabIndex={-1}>
                Reset
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={createAssignment}
              disabled={
                assignment === "" || (type === "Rubric" && parts.length === 0)
              }
              endIcon={<Add />}
            >
              Add
            </Button>
          )}
        </Stack>
        <Stack gap={2} sx={{ minWidth: 300 }}>
          <List dense sx={{ maxHeight: "60vh", overflowY: "auto", pt: 0 }}>
            {assignments.length > 0 &&
              assignments.map(({ title, type, parts, id }, i) => (
                <ListItem
                  key={id}
                  component={Paper}
                  disablePadding
                  divider
                  secondaryAction={
                    <Tooltip title="Delete assignment" arrow disableInteractive>
                      <IconButton
                        color="error"
                        tabIndex={-1}
                        onClick={() => {
                          setConfirmData({
                            title: "Remove assignment",
                            description: `Delete ${title}?`,
                            actions: [
                              {
                                action: () => deleteAssignment({ id, classId }),
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
                  }
                >
                  <Tooltip title="Edit assignment" arrow disableInteractive>
                    <ListItemButton
                      onClick={() => handleEdit({ title, type, parts, id })}
                      sx={{ width: "100%", py: 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: "unset" }}>
                        <Typography color="text.secondary" pr={1}>
                          {i + 1}.
                        </Typography>
                      </ListItemIcon>
                      <Stack>
                        <Typography>{title}</Typography>
                        {type === "Rubric" &&
                          parts.map((val, t) => (
                            <Typography
                              key={t}
                              variant="caption"
                              color="text.secondary"
                            >
                              {`${t + 1}. ${val}`}
                            </Typography>
                          ))}
                      </Stack>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
          </List>
        </Stack>
      </Stack>
    </Dialog>
  );
}
