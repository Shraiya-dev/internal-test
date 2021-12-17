import React, { useState } from "react";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "./ErrorModal";

const useStyles = makeStyles((theme) => ({
  step: {
    borderRadius: "5px",
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(2),
    textAlign: "left",
    color: "#ffffff",
    [theme.breakpoints.up("md")]: {
      width: "98%",
      display: "block",
      textAlign: "center",
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: theme.shadows[5],
    },
  },
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    gap: "8px",
  },
  bold: {
    fontWeight: "600",
    color: "black",
  },
}));

const colors = {
  goldenYellow: "#FC8E01",
  purple: "#3451FF",
  blue: "#0089EC",
  skyBlue: "#01B9E5",
  green: "#17BA76",
};

const noCandidates =
  "We are allocating the workers for your booking. We will notify you shortly.";

function Step(props) {
  const { number, title, color, statusType, bookingId, setOpen } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  const onStepClicked = () => {
    if (number < 1) {
      return setOpen(true);
    }
    return navigate(`/${bookingId}/workers/${statusType}`);
  };

  return (
    <Box
      className={classes.step}
      style={{ border: `solid 2px ${color}` }}
      onClick={onStepClicked}
    >
      <Typography className={classes.bold}>{number}</Typography>
      <Typography className={classes.bold}>{title}</Typography>
    </Box>
  );
}

export const StatusTracker = ({ hiringInfo, bookingId }) => {
  const classes = useStyles();
  const { green } = colors;
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const step1 = {
    bookingId,
    number: hiringInfo["APPLIED"],
    statusType: "APPLIED",
    title: "New Applied",
    color: "#9CA3AF",
    setOpen,
  };

  const step2 = {
    bookingId,
    number: hiringInfo["SCREENING"],
    statusType: "SCREENING",
    title: "Screening",
    color: "#9CA3AF",
    setOpen,
  };

  const step3 = {
    bookingId,
    number: hiringInfo["INTERVIEW"],
    statusType: "INTERVIEW",
    title: "Interview",
    color: "#9CA3AF",
    setOpen,
  };

  const step4 = {
    bookingId,
    number: hiringInfo["OFFER"],
    statusType: "OFFER",
    title: "Offer",
    color: "#9CA3AF",
    setOpen,
  };

  const step5 = {
    bookingId,
    number: hiringInfo["HIRED"],
    statusType: "HIRED",
    title: "Hired",
    color: green,
    setOpen,
  };

  //use map to eliminate repitition
  return (
    <article className={classes.container}>
      <Step {...step1} />
      <Step {...step2} />
      <Step {...step3} />
      <Step {...step4} />
      <Step {...step5} />
      {open && (
        <ErrorModal
          message={noCandidates}
          open={open}
          handleClose={handleClose}
        />
      )}
    </article>
  );
};
