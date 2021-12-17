import { Box } from "@material-ui/core";
import React from "react";
import { Heading } from "./Heading";
import { InfoWithDuration } from "./InfoWithDuration";

export const Education = () => {
  return (
    <Box p={4} pt={0} pb={2}>
      <Box
        pb={4}
        sx={
          {
            // borderBottom: "solid 1px #E5E7EB",
          }
        }
      >
        <Heading heading={"Education"} />
        <InfoWithDuration
          title={"Welding at KGTTI Bengaluru"}
          description={"2018 - 2019"} //(2 years 3 months) implement total duration calculator
        />
      </Box>
    </Box>
  );
};
