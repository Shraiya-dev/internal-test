import React from "react";
import { Typography } from "@material-ui/core";
import { FieldWithDropdown } from "../ProfileDetail/components/FieldWithDropdown";
import { useWorkerProfile } from "../../providers/WorkerProfileProvider/WorkerProfileProvider";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  workerType: {
    fontSize: "1rem",
  },
}));

const workerTypes = ["Helper", "Technician", "Supervisor"];

export const WorkerType = ({ workerType }) => {
  const { editMode, editWorkerState } = useWorkerProfile();
  const classes = useStyles();
  return (
    <>
      {editMode ? (
        <FieldWithDropdown
          fieldName={"Worker Type"}
          value={editWorkerState?.workerType}
          name={"workerType"}
          dropDownList={workerTypes}
        />
      ) : (
        <Typography
          className={classes.workerType}
          variant="h2"
          component="p"
          color="textSecondary"
        >
          {workerType}
        </Typography>
      )}
    </>
  );
};
