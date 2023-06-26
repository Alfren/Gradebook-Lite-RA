import { useEffect, useState, useRef } from "react";
import {
  Button,
  Chip,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import {
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
} from "../store/rtk";
import ConfirmDialog from "./ConfirmDialog";
import CloseButton from "./CloseButton";
import { useSelector } from "react-redux";

export default function AssignmentModal({
  assignments,
  open,
  toggle,
  classId,
}) {
  const { id: teacherId } = useSelector((state) => state.user);
  const [postAssignment] = useCreateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();
  const [assignment, setAssignment] = useState("");
  const [type, setType] = useState("Single");

  const [newPartTitle, setNewPartTitle] = useState("");
  const [parts, setParts] = useState([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  const createAssignment = () => {
    let body = { title: assignment, type, teacherId, classId };
    if (type === "Multiple") body.parts = parts;
    postAssignment(body)
      .then(() => {
        setAssignment("");
        setParts([]);
        setNewPartTitle("");
        setType("Single");
      })
      .catch((error) => {
        console.error(error);
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

  return (
    <Dialog open={open} onClose={toggle} maxWidth="md">
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
        <Stack spacing={2} sx={{ minWidth: 300 }} component={Paper} p={1}>
          <Typography variant="h6" align="center">
            New Assignment
          </Typography>
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
                : "Type 'Multiple' can have sub-grades"
            }
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Multiple">Multiple</MenuItem>
          </TextField>
          {type === "Multiple" && (
            <>
              {chipList.length > 0 && (
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
              )}
              <Stack direction="row" spacing={2}>
                <TextField
                  value={newPartTitle}
                  onChange={(e) => setNewPartTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newPartTitle !== "")
                      handleAddPart();
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
              {type === "Multiple" && (
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
              )}
            </>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={createAssignment}
            disabled={
              assignment === "" || (type === "Multiple" && parts.length === 0)
            }
            endIcon={<Add />}
          >
            Create Assignment
          </Button>
        </Stack>
        <Stack spacing={2} sx={{ minWidth: 300 }}>
          <List dense sx={{ maxHeight: "60vh", overflowY: "auto", pt: 0 }}>
            {assignments.length > 0 &&
              assignments.map(({ title, type, parts, id }, i) => (
                <ListItem key={id} component={Paper} sx={{ mb: 1 }}>
                  <ListItemAvatar sx={{ minWidth: "unset" }}>
                    <Typography color="text.secondary" component="span" pr={1}>
                      {i + 1}.
                    </Typography>
                  </ListItemAvatar>
                  <ListItemText flex={1}>
                    <Stack>
                      <Typography>{title}</Typography>
                      {type === "Multiple" &&
                        parts.map((val, t) => (
                          <Typography
                            key={t}
                            ml={1}
                            variant="caption"
                            color="text.secondary"
                          >
                            {`${t + 1}. ${val}`}
                          </Typography>
                        ))}
                    </Stack>
                  </ListItemText>
                  <IconButton
                    color="error"
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
                </ListItem>
              ))}
          </List>
        </Stack>
      </Stack>
    </Dialog>
  );
}
