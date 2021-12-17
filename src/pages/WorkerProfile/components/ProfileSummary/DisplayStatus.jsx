import React from "react";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  status: {
    width: "100%",
    backgroundColor: "#E5E7EB",
    padding: theme.spacing(0.5),
    borderRadius: "3px",
    display: "grid",
    placeItems: "center",
    marginTop: theme.spacing(2),
  },
  activeStep: {
    backgroundColor: "#10B981",
    color: "#fff",
  },
  firstStep: {
    borderTopLeftRadius: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(2),
  },
  lastStep: {
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
}));

const Step = ({ stepNum, activeStep }) => {
  const classes = useStyles();
  let classList = clsx(classes.status);

  if (stepNum === 1) {
    classList = clsx(classes.status, classes.firstStep);
  }

  if (stepNum <= activeStep) {
    classList = clsx(classes.status, classes.activeStep);
  }

  if (stepNum <= activeStep && stepNum === 1) {
    classList = clsx(classes.status, classes.activeStep, classes.firstStep);
  }

  if (stepNum === 5) {
    classList = clsx(classes.status, classes.lastStep);
  }

  if (stepNum <= activeStep && stepNum === 5) {
    classList = clsx(classes.status, classes.activeStep, classes.lastStep);
  }

  return <Box className={classList}>{stepNum}</Box>;
};

export const DisplayStatus = ({ activeStep }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px",
        width: "100%",
      }}
    >
      <Step stepNum={1} activeStep={activeStep} />
      <Step stepNum={2} activeStep={activeStep} />
      <Step stepNum={3} activeStep={activeStep} />
      <Step stepNum={4} activeStep={activeStep} />
      <Step stepNum={5} activeStep={activeStep} />
    </Box>
  );
};
