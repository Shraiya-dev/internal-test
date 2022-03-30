import React from "react";
import TextField from "@mui/material/TextField";
import "./Input.css";

const defaultProps = {
  name: "",
  label: "",
  type: "text",
  value: "",
  error: false,
  helperText: "",
  fullWidth: false,
  maxValue: Infinity,
  onChange: () => {},
};

const Input = ({
  name = defaultProps.name,
  label = defaultProps.label,
  type = defaultProps.type,
  value = defaultProps.value,
  error = defaultProps.error,
  helperText = defaultProps.helperText,
  fullWidth = defaultProps.fullWidth,
  maxValue = defaultProps.maxValue,
  onChange = defaultProps.onChange,
}) => {
  return (
    <TextField
      id={`outlined-basic-${name}`}
      className="custom_input"
      variant="outlined"
      name={name}
      label={label}
      type={type}
      value={value}
      error={error}
      helperText={error ? helperText : ""}
      fullWidth={fullWidth}
      onChange={onChange}
      InputProps={{ inputProps: { maxLength: maxValue } }}
    />
  );
};

export default Input;
