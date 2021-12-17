import axios from "axios";
import { getProfilesFromStatusAPI } from "../../../api";

export const getProfilesFromStatus = async (bookingId, status) =>
  await axios.get(getProfilesFromStatusAPI(bookingId, status));
