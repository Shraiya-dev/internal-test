import React from "react";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "#4B5563",
    padding: theme.spacing(1.25),
    borderRadius: "50%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1.25),
    backgroundColor: "#E5E7EB",
    fontSize: "1rem",
  },
}));

export const ActionIcons = () => {
  const classes = useStyles();
  return (
    <Box>
      <EmailOutlinedIcon className={classes.icon} />
      <EventOutlinedIcon className={classes.icon} />
      <PhoneOutlinedIcon className={classes.icon} />
    </Box>
  );
};
