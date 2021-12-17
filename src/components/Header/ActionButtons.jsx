import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import { TAP_ROUTE } from "../../routes";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    gap: theme.spacing(2),
  },
  btn: {
    textTransform: "none",
  },
}));

export const ActionButtons = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  return (
    <div className={classes.container}>
      <Button variant="contained" color="primary" className={classes.btn}>
        Assign
      </Button>
      {pathname !== TAP_ROUTE && (
        <Link to={TAP_ROUTE}>
          <Button variant="contained" color="primary" className={classes.btn}>
            Tap
          </Button>
        </Link>
      )}
    </div>
  );
};
