import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  workerName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
}));

export const WorkerName = ({ name }) => {
  const classes = useStyles();
  return (
    <Typography className={classes.workerName} variant="h1" component="p">
      {name}
    </Typography>
  );
};
