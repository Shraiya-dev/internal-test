import axios from "axios";
import { GET_JOB_TYPES_API } from "../api";

export const getJobTypes = async () => {
  return await axios.get(GET_JOB_TYPES_API);
};
