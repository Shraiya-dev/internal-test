import React from "react";
import { extractResponse } from "../../../utils";
import { useCustomerBookings } from "../providers/CustomerBookingsProvider";
import { makeStyles } from "@material-ui/core";
import { StatusCard } from "./StatusCard";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(1),
    },
  },
}));

export const Bookings = () => {
  const { isSuccess, error, data } = useCustomerBookings();
  const classes = useStyles();

  let res = null;
  let bookings = null;

  if (error) {
    return <p>{error}</p>;
  }

  if (isSuccess) {
    res = extractResponse(data);
    if (res?.error) {
      return <p>{res.error}</p>;
    }
    if (res?.data) {
      bookings = res.data;
    }
  }

  if (bookings?.length === 0) {
    return <h1>No bookings</h1>;
  }

  return (
    <section className={classes.container}>
      {bookings?.map((booking) => (
        <StatusCard key={booking.bookingId} booking={booking} />
      ))}
    </section>
  );
};
