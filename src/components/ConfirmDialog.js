import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ConfirmDialog({
  open = false,
  toggle,
  data: {
    title = "Are you sure?",
    description = "Continue with this action?",
    actions,
  },
}) {
  const performAction = (action) => {
    toggle();
    if (action) {
      action(true);
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", gap: 3 }}>
        <Button onClick={toggle}>{actions?.length ? "Go Back" : "OK"}</Button>
        {actions?.length &&
          actions.map((opt, i) => (
            <Button
              onClick={() => performAction(opt.action)}
              color={opt.color || "primary"}
              key={`action-button-${i}`}
              disabled={opt.disabled || false}
            >
              {opt.label}
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
}
