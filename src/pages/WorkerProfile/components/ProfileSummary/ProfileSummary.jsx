import React from "react";
import { makeStyles, Grid, CardContent, Paper } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import ContactDetail from "./ContactDetail";
import { AllocatedJobs } from "./AllocatedJobs";
import { VaccinatedBadge } from "./VaccinatedBadge";
import { WorkerType } from "./WorkerType";
import { ProfilePic } from "./ProfilePic";
import { WorkerName } from "./WorkerName";
import { ProfilePicProvider } from "../../providers/ProfilePicProvider/ProfilePicProvider";

const useStyles = makeStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    textAlign: "center",
  },
  content: {
    padding: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  borderBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: "solid 1px #E5E7EB",
    width: "100%",
  },
}));

export const ProfileSummary = ({ worker }) => {
  const classes = useStyles();

  const { name, rating, contactDetails, workerType, vaccination, pp } = worker;
  return (
    <Grid item xs={12} sm={4}>
      <Paper className={classes.root} variant="outlined">
        <header className={classes.header}>
          <ProfilePicProvider>
            <ProfilePic profilePic={pp} />
          </ProfilePicProvider>
          <WorkerName name={name} />
          <WorkerType workerType={workerType} />
        </header>

        <CardContent className={classes.content}>
          {/* <ActionIcons /> */}
          <Rating
            name="worker-rating"
            value={parseInt(rating)}
            size="small"
            readOnly
          />
          <VaccinatedBadge vaccination={vaccination} />
          <div className={classes.borderBox}>
            <AllocatedJobs worker={worker} />
          </div>
          <ContactDetail contactDetails={contactDetails} />
        </CardContent>
      </Paper>
    </Grid>
  );
};
