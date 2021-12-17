import React from "react";
import { Typography } from "@material-ui/core";

export const Heading = ({ heading }) => {
  return (
    <Typography
      variant="h6"
      component="h3"
      style={{ fontWeight: "bold", fontSize: "1.2rem" }}
    >
      {heading}
    </Typography>
  );
};
