import React from "react";
import { makeStyles } from "@material-ui/core";
import { useProfilePic } from "../../providers/ProfilePicProvider/ProfilePicProvider";

const useStyles = makeStyles((theme) => ({
  outOfView: {
    position: "fixed",
    zIndex: "-20",
    left: "10000px",
  },
}));

export const UploadProfile = ({ reference }) => {
  const classes = useStyles();
  const { onSelectFile } = useProfilePic();

  return (
    <input
      className={classes.outOfView}
      type="file"
      accept="image/*"
      multiple={false}
      onChange={onSelectFile}
      ref={reference}
    />
  );
};
