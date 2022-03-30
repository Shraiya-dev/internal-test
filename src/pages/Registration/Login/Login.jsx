import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

// Assets
import ProjectHeroLogo from "../assets/images/projectHero_black_logo.svg";

// MUI Imports
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// Components
import ButtonWidget from "../components/ButtonWidget/ButtonWidget";
import Input from "../components/Input/Input";
import Toast from "../components/Toast/Toast";

// Helpers
import { validateIsNum, validatePhoneNumber } from "../helpers/validators";
import { getOtp } from "../helpers/api";
import { getToken } from "../helpers/common";

// Constants
import { ERROR_TEXT } from "../utils/constants/text";

const useStyles = makeStyles({
  root: {
    margin: "0 2rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  imgDiv: {
    textAlign: "center",
    marginTop: "7rem",
    backgroundColor: "#000",
    borderRadius: "20px",
  },
  imgWrapper: {
    maxHeight: "250px",
    maxWidth: "80%",
    width: "auto",
    padding: "2.7rem 0",
  },
  mainHeading: {
    color: "#0d0c22",
    fontSize: "2rem",
    fontWeight: 900,
    marginBottom: "1.2rem",
  },
  paragraphText: {
    color: "#79797b",
    fontWeight: 500,
    marginBottom: "2.5rem",
  },
  noAccount: {
    marginTop: "3rem",
    textAlign: "center",
    color: "#9c9c9d",
    fontSize: "1rem",
    "& a": {
      color: "#6967c4",
      fontWeight: 800,
      cursor: "pointer",
      textDecoration: "none",
    },
  },
  contactInfo: {
    marginTop: "1rem",
  },
  gridContainer: {
    justifyContent: "center",
  },
  otpHelperText: {
    position: "relative",
    top: -30,
  },
});

const PROJECT_HERO_MOB_NO_FORMATTED = "+91 6380-437-119";
const PROJECT_HERO_MOB_NO = "+916380437119";

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastStatus, setToastStatus] = useState("success");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getToken("accessToken")) {
      navigate("/registration");
    }
    setShowComponent(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenToast = (message, status) => {
    setToastMessage(message);
    setToastStatus(status);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
    setToastMessage("");
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (mobileNumber === "" && value === 0) {
      return;
    }
    if (validateIsNum(value) || value === "") {
      setMobileNumber(value);
    }
    setMobileNumberError(false);
  };

  const prepareData = () => ({
    phoneNumber: `+91${mobileNumber}`,
    login: true,
    ut: "partner",
  });

  const mobileNumberSubmitCallback = (success, message) => {
    setIsLoading(false);
    if (success) {
      navigate("/otp-verify", {
        state: {
          mobileNumber,
          otpSent: true,
          toast: { show: true, message, status: "success" },
        },
      });
    } else {
      setMobileNumberError(true);
    }
    handleOpenToast(message, success ? "success" : "error");
  };

  const handleMobileNumberSubmit = (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(mobileNumber)) {
      setMobileNumberError(true);
      return;
    }
    setIsLoading(true);
    getOtp(prepareData(), mobileNumberSubmitCallback);
  };
  return showComponent ? (
    <>
      <div className={classes.root}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className={classes.imgDiv}>
                <img
                  src={ProjectHeroLogo}
                  alt="Project Hero red and white logo"
                  className={classes.imgWrapper}
                />
              </div>
              <div>
                <p className={classes.mainHeading}>OTP Verification</p>
                <p className={classes.paragraphText}>
                  We will send you a One Time Password on this mobile number
                </p>
              </div>
              <>
                <Input
                  id="mobileNumberInput"
                  maxValue={10}
                  value={mobileNumber}
                  name="mobileNumber"
                  label="Mobile number"
                  onChange={handleMobileNumberChange}
                  fullWidth
                  error={mobileNumberError}
                  helperText={ERROR_TEXT.INVALID_MOBILE_NUMBER}
                  autoFocus
                />
                <ButtonWidget
                  label="Get OTP"
                  extraStyle={{ width: "100%" }}
                  disabled={isLoading}
                  handleClick={handleMobileNumberSubmit}
                />
              </>
              <div>
                <p className={classes.noAccount}>{`Not a partner yet?`}</p>
                <p className={clsx(classes.noAccount, classes.contactInfo)}>
                  Reach out to{"  "}
                  <a href={`tel:${PROJECT_HERO_MOB_NO}`}>
                    {PROJECT_HERO_MOB_NO_FORMATTED}
                  </a>
                  {"  "}
                  to register yourself as a partner
                </p>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Toast
        open={showToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        status={toastStatus}
      />
    </>
  ) : null;
};

export default Login;
