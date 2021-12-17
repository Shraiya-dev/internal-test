import React from "react";
import { useVaccinationCert } from "../../../providers/VaccinationCertProvider/VaccinationCertProvider";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  outOfView: {
    position: "fixed",
    zIndex: "-20",
    left: "10000px",
  },
}));

export const UploadCertificate = ({ reference }) => {
  const classes = useStyles();
  const { onSelectFile } = useVaccinationCert();

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
