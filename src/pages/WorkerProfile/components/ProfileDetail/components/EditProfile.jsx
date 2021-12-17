import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { Box, Button, IconButton } from "@material-ui/core";
import { useWorkerProfile } from "../../../providers/WorkerProfileProvider/WorkerProfileProvider";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  btn: {
    textTransform: "none",
  },
  saveBtn: {
    backgroundColor: "#059669",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#065F46",
    },
  },
}));

const ActionButtons = () => {
  const classes = useStyles();
  const { onCancelClicked, onSaveClicked } = useWorkerProfile();
  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Button
        onClick={onCancelClicked}
        variant="outlined"
        color="primary"
        className={classes.btn}
      >
        Cancel
      </Button>
      <Button
        onClick={onSaveClicked}
        variant="contained"
        className={clsx(classes.btn, classes.saveBtn)}
        endIcon={<SaveIcon />}
      >
        Save
      </Button>
    </Box>
  );
};

export const EditProfile = () => {
  const { onEditIconClicked, editMode } = useWorkerProfile();
  return (
    <>
      {editMode ? (
        <ActionButtons />
      ) : (
        <IconButton onClick={onEditIconClicked}>
          <EditIcon />
        </IconButton>
      )}
    </>
  );
};
