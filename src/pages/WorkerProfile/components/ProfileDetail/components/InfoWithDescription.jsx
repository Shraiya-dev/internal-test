import React, { useState } from "react";
import { Box, TextField, Typography } from "@material-ui/core";
import { useWorkerProfile } from "../../../providers/WorkerProfileProvider/WorkerProfileProvider";
// import DeleteIcon from "@material-ui/icons/Delete";
import ClearIcon from "@material-ui/icons/Clear";
import { SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "75%",
    },
  },
  editableFieldsContainer: {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-between",
  },
  removeIcon: {
    color: (props) => props.color,
    padding: theme.spacing(1),
    borderRadius: "50%",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#F3F4F6",
      color: (props) => props.hover,
    },
  },
}));

const RemoveIcon = ({ color }) => {
  const classes = useStyles(color);
  return (
    <SvgIcon className={classes.removeIcon}>
      <ClearIcon />
    </SvgIcon>
  );
};

const EditableFields = ({ title, duration, id }) => {
  const classes = useStyles();
  const [titleAndDuration, setTitleAndDuration] = useState({ title, duration });
  const onTitleAndDurationChange = (e) => {
    const fieldName = e.target.name;
  };

  let deleteIconColor = { color: "#9CA3AF", hover: "#6B7280" };

  return (
    <li className={classes.editableFieldsContainer}>
      <article className={classes.textField}>
        <TextField
          size="small"
          value={titleAndDuration.title}
          name={"title"}
          style={{ display: "block" }}
          fullWidth
        />
        <TextField
          size="small"
          value={titleAndDuration.duration}
          name={"duration"}
          style={{ display: "block" }}
          fullWidth
        />
      </article>
      <aside>
        <RemoveIcon color={deleteIconColor} />
      </aside>
    </li>
  );
};

const ReadOnlyFields = ({ title, duration }) => {
  return (
    <>
      <Typography
        style={{
          marginBottom: "0.4rem",
          fontWeight: "600",
        }}
      >
        {title}
      </Typography>
      <Typography color="textSecondary" style={{ fontSize: "0.9rem" }}>
        {duration}
      </Typography>
    </>
  );
};

export const InfoWithDescription = ({ title, duration, id }) => {
  const { editMode } = useWorkerProfile();

  return (
    <Box pt={2}>
      <ReadOnlyFields title={title} duration={duration} />

      {/* {editMode ? (
        <EditableFields title={title} duration={duration} id={id} />
      ) : (
        <ReadOnlyFields title={title} duration={duration} />
      )} */}
    </Box>
  );
};
