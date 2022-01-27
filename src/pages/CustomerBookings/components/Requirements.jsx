import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
// import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  icons: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "1.25rem",
    marginRight: "0.5rem",
  },
  spacing: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(0),
    },
  },
  flex: {
    display: "flex",
  },
  iconContainer: {
    display: "block",
    gap: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      width: "100%",
    },
  },
  mediumFont: {
    fontSize: "1rem",
  },
}));

export const Requirements = (props) => {
  const classes = useStyles();
  const { bookingDuration, state, city, shiftTime } = props;
  const location = `${city}, ${state}`;

  return (
    <Grid container className={classes.iconContainer}>
      {/* <Grid item>
        <div className={clsx(classes.flex, classes.spacing)}>
          <AssignmentIndOutlinedIcon className={classes.icons} />
          <Typography
            className={classes.mediumFont}
            variant="body2"
            component="p"
            color="textSecondary"
          >
            {jobType}
          </Typography>
        </div>
      </Grid> */}
      <Grid item>
        <div className={clsx(classes.flex, classes.spacing)}>
          <ScheduleIcon className={classes.icons} />
          <Typography
            className={classes.mediumFont}
            variant="body2"
            component="p"
            color="textSecondary"
          >
            {`Shift Timing: ${shiftTime}`}
          </Typography>
        </div>
      </Grid>
      <Grid item>
        <div className={clsx(classes.flex, classes.spacing)}>
          <ScheduleIcon className={classes.icons} />
          <Typography
            className={classes.mediumFont}
            variant="body2"
            component="p"
            color="textSecondary"
          >
            {bookingDuration}
          </Typography>
        </div>
      </Grid>

      <Grid item>
        <div className={classes.flex}>
          <LocationOnOutlinedIcon className={classes.icons} />
          <Typography
            className={classes.mediumFont}
            variant="body2"
            component="p"
            color="textSecondary"
          >
            {location}
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};
