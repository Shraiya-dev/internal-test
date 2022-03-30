import React from "react";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#28c78e",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  borderColor: "#28c78e",
  "input:hover ~ &": {
    backgroundColor: "#28c78e",
  },
  boxShadow: "none",
});

const BpRadio = (props) => (
  <Radio
    sx={{
      "&:hover": {
        bgcolor: "transparent",
      },
    }}
    disableRipple
    color="default"
    checkedIcon={<BpCheckedIcon />}
    icon={<BpIcon />}
    {...props}
  />
);

export const RadioInputFieldWithBorder = styled((props) => (
  <FormControlLabel
    control={<BpRadio />}
    {...props}
    style={{
      marginLeft: 0,
      border: `1px solid ${
        props.selected === props.value ? "#28c78e" : "#e2e2e1"
      }`,
      borderRadius: 3,
      width: "95%",
      background: `${
        props.selected === props.value ? "#edfaf6" : "transparent"
      }`,
    }}
  />
))(({ theme }) => ({
  "& .MuiRadio-root": {
    padding: "17px 12px",
  },
  "& .MuiTypography-root": {
    paddingRight: "12px",
    fontWeight: 600,
  },
}));

export const RadioInputField = styled((props) => (
  <FormControlLabel
    control={<BpRadio />}
    {...props}
    style={{
      borderRadius: 3,
      width: "95%",
      marginTop: "-20px",
    }}
  />
))(({ theme }) => ({
  "& .MuiRadio-root": {
    padding: "0px 12px",
  },
  "& .MuiTypography-root": {
    paddingRight: "12px",
    fontWeight: 600,
  },
}));
