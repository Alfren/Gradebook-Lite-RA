import { Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";

export default function ModalCloseButton({ action, placement }) {
  return (
    <Tooltip title="Close" arrow disableInteractive>
      <IconButton
        sx={{ position: "absolute", top: 5, [placement || "right"]: 5 }}
        onClick={action}
        size="small"
      >
        <Close />
      </IconButton>
    </Tooltip>
  );
}
