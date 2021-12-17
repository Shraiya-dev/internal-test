import React from "react";
import { Container, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { DisplayStatus } from "./DisplayStatus";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  bottomSpacing: {
    marginBottom: theme.spacing(0.5),
  },
  title: {
    textAlign: "start",
    textTransform: "uppercase",
    fontSize: "0.8rem",
    marginBottom: theme.spacing(2),
  },
  boldTitle: {
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: "0.9rem",
  },
  roundedBorderBox: {
    border: "solid 1px #E5E7EB",
    borderRadius: theme.spacing(2),
  },
  solidBackground: {
    backgroundColor: "#E5E7EB",
  },
  bold: {
    fontWeight: "bold",
  },
  statusDot: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#10B981",
  },
}));

export const AllocatedJobs = ({ worker }) => {
  const classes = useStyles();

  const { contactDetails, workerType, jobType, status, statusInd } = worker;

  const location = `${contactDetails.city}${
    contactDetails?.state && ", " + contactDetails.state
  }`;

  return (
    <Container className={classes.root}>
      <Typography className={classes.title}>Current Role</Typography>
      <Box
        p={1}
        mb={3}
        className={clsx(classes.roundedBorderBox, classes.solidBackground)}
      >
        <Typography className={clsx(classes.bottomSpacing, classes.boldTitle)}>
          {jobType}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Typography color="textSecondary" className={classes.subTitle}>
            {workerType}
          </Typography>
          <Typography color="textSecondary" className={classes.subTitle}>
            {" "}
            •{" "}
          </Typography>
          <Typography color="textSecondary" className={classes.subTitle}>
            {location}
          </Typography>
        </Box>
      </Box>
      <Box p={1} className={clsx(classes.roundedBorderBox)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Typography className={classes.subTitle}>Status</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              gap: "0.5rem",
            }}
          >
            <Typography
              color="textSecondary"
              className={clsx(classes.subTitle, classes.statusDot)}
            >
              {" "}
              •{" "}
            </Typography>
            <Typography className={clsx(classes.subTitle, classes.bold)}>
              {status} {/* This should come from backend   */}
            </Typography>
          </Box>
        </Box>
        <DisplayStatus activeStep={statusInd} />
      </Box>
    </Container>
  );
};
