import React from "react";
import { Box, Typography } from "@material-ui/core";

export const NotKnown = ({ message }) => {
  return (
    <Box py={0} pt={1}>
      <Typography variant="body2" component="p" style={{ color: "#9CA3AF" }}>
        {message || ""}
      </Typography>
    </Box>
  );
};
