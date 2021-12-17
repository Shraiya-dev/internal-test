import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#C2CFD9",
  },
  tabs: {
    margin: "auto",
    width: "40%",
    display: "flex",
    justifyContent: "space-between",
  },
  tabTitle: {
    fontSize: "1.125rem",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  activeTab: {
    borderBottom: "solid 3px #065F46",
  },
}));

export const TapTabs = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.tabs}>
        <Typography className={classes.tabTitle}>Tap Done</Typography>
        <Typography className={clsx(classes.tabTitle, classes.activeTab)}>
          Tap Required
        </Typography>
      </div>
    </div>
  );
};
