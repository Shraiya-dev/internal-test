import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Heading } from "./Heading";
import { NotKnown } from "./NotKnown";

const Skill = ({ title }) => {
  return (
    <Box
      p={1}
      pt={0.5}
      pb={0.5}
      sx={{ backgroundColor: "#E5E7EB", borderRadius: "2rem" }}
    >
      <Typography style={{ fontSize: "0.9rem" }}>{title}</Typography>
    </Box>
  );
};

export const Skills = ({ skills }) => {
  return (
    <Box p={2} pt={0} pb={2}>
      <Heading heading={"Skills"} />
      <Box
        // pt={2}
        pb={4}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          //   borderBottom: "solid 1px #E5E7EB",
        }}
      >
        {/* <Skill title={workerType} /> */}
        {skills?.length === 0 && <NotKnown message={"Not Available"} />}
        {skills?.length > 0 &&
          skills.map((skill, idx) => <Skill key={idx} title={skill} />)}
      </Box>
    </Box>
  );
};
