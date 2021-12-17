import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { useCustomerBookings } from "../providers/CustomerBookingsProvider";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gap: theme.spacing(1),
    alignItems: "flex-start",
    [theme.breakpoints.up("sm")]: {
      gap: theme.spacing(2),
      gridTemplateColumns: "6fr 2fr",
    },
  },
}));

export const SearchCustomer = () => {
  const classes = useStyles();
  const {
    phoneNumber,
    onPhoneNumberChange,
    validationError,
    onPhoneNumberSubmit,
    isLoading,
  } = useCustomerBookings();

  return (
    <form onSubmit={onPhoneNumberSubmit}>
      <div className={classes.container}>
        <TextField
          label="Enter customer phone number"
          autoFocus
          variant="outlined"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          fullWidth
          size="small"
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
          }}
          error={validationError ? true : false}
          helperText={validationError || ""}
        />
        <Button
          style={{ textTransform: "none" }}
          type="submit"
          variant="contained"
          color="primary"
          startIcon={!isLoading && <SearchIcon />}
        >
          {isLoading ? (
            <CircularProgress style={{ color: "#ffffff" }} size={25} />
          ) : (
            `Search`
          )}
        </Button>
      </div>
    </form>
  );
};
