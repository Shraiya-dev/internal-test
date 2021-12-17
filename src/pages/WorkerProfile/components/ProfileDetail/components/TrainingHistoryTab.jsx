import React from "react";
import { Box } from "@material-ui/core";
// import { InfoWithDescription } from "./InfoWithDescription";
import { NotKnown } from "./NotKnown";

export const TrainingHistoryTab = () => {
  return (
    <Box
      p={2}
      pb={2}
      pt={0}
      sx={{
        minHeight: "475px",
      }}
    >
      <Box pb={2}>
        <NotKnown message={"Not Available"} />
        {/* <InfoWithDescription
          title={"Texture Painting - Institute of Texture Painting, UP"}
          duration={"December 2020 - May 2021"}
        />
        <InfoWithDescription
          title={"Mixing and Matching - Paint mixing workshop, Lucknow"}
          duration={"April 2019 - June 2020"}
        />
        <InfoWithDescription
          title={"Putty - House painting Basics, Painting workshop, Lucknow"}
          duration={"Mar 2017 - May 2017"}
        /> */}
      </Box>
    </Box>
  );
};
