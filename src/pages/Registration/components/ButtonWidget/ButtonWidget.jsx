import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import "./ButtonWidget.css";

const defaultProps = {
  handleClick: () => {},
  label: "",
  disabled: false,
  extraStyle: {},
};

const ButtonWidget = ({
  handleClick = defaultProps.handleClick,
  label = defaultProps.label,
  disabled = defaultProps.disabled,
  extraStyle = defaultProps.extraStyle,
}) => {
  return (
    <LoadingButton
      variant="contained"
      onClick={handleClick}
      className="customized_button"
      style={extraStyle}
      disabled={disabled}
      loading={disabled}
    >
      {label}
    </LoadingButton>
  );
};

export default ButtonWidget;
