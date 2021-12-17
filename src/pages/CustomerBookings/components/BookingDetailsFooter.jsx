import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ScheduleIcon from "@material-ui/icons/Schedule";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  dot: {
    display: "none",
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: "inline",
    },
  },
  mediumFont: {
    fontSize: "1rem",
  },
  spacing: {
    marginBottom: theme.spacing(1),
  },
  flex: {
    gap: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      alignItems: "center",
    },
  },
  bookingInfo: {
    marginTop: theme.spacing(1),
  },
  icons: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "1.25rem",
    marginRight: "0.5rem",
  },
}));

// const getTotalCandidates = (hiringInfo) => {
//   const total =
//     hiringInfo["APPLIED"] +
//     hiringInfo["SCREENING"] +
//     hiringInfo["INTERVIEW"] +
//     hiringInfo["OFFER"] +
//     hiringInfo["HIRED"];

//   return total;
// };

export const BookingDetailsFooter = ({ hiringInfo, createdOn }) => {
  const classes = useStyles();

  // const numberOfCandidates = `Total ${getTotalCandidates(hiringInfo)} workers`;

  const date = createdOn.split(" ");
  const dateOfCreation = `Created on ${date[0]} ${date[1]} ${date[2]} `;

  return (
    <div className={clsx(classes.flex, classes.bookingInfo)}>
      {/* <Typography
        variant="body2"
        component="p"
        color="textSecondary"
        className={clsx(classes.spacing, classes.mediumFont)}
      >
        {numberOfCandidates}
      </Typography> */}
      {/* <Typography
        variant="body2"
        component="p"
        color="textSecondary"
        className={classes.dot}
      >
        {"•"}
      </Typography> */}
      <div style={{ display: "flex" }}>
        <ScheduleIcon className={classes.icons} />
        <Typography
          variant="body2"
          component="p"
          color="textSecondary"
          className={clsx(classes.spacing, classes.mediumFont)}
        >
          {dateOfCreation}
        </Typography>
      </div>
    </div>
  );
};
