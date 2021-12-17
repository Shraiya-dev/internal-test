import axios from "axios";
import { getCustomerBookingsAPI } from "../../../api";

export const getCustomerBookings = async (phoneNumber) =>
  axios.get(getCustomerBookingsAPI(phoneNumber));
