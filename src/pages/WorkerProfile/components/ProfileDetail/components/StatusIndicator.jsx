import React from "react";
import { Box, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { useWorkerProfile } from "../../../providers/WorkerProfileProvider/WorkerProfileProvider";
import { FieldWithDropdown } from "./FieldWithDropdown";

const useStyles = makeStyles((theme) => ({
  subTitle: {
    fontSize: "0.9rem",
  },
  statusDot: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#10B981",
  },
  bold: {
    fontWeight: "bold",
  },
}));

const vaccinationStatuses = ["Complete", "Partial", "Not Vaccinated"];

const getDoseIndicatorColor = (vaccinationStatus) =>
  vaccinationStatus === "Complete" ? "#10B981" : "#F59E0B";

export const StatusIndicator = ({ vaccinationStatus }) => {
  const classes = useStyles();
  const { editMode, editWorkerState } = useWorkerProfile();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "0.5rem",
        marginLeft: "auto",
      }}
    >
      {editMode ? (
        <FieldWithDropdown
          fieldName={""}
          value={editWorkerState && editWorkerState?.vaccination?.status}
          name={"vaccinationStatus"}
          dropDownList={vaccinationStatuses}
        />
      ) : (
        <>
          {vaccinationStatus !== "Not Vaccinated" && (
            <CheckCircleIcon
              style={{
                fontSize: "1.125rem",
                color: getDoseIndicatorColor(vaccinationStatus),
              }}
            />
          )}
          <Typography
            className={clsx(classes.subTitle, classes.bold)}
            style={{ color: getDoseIndicatorColor(vaccinationStatus) }}
          >
            {vaccinationStatus}
          </Typography>
        </>
      )}
    </Box>
  );
};
