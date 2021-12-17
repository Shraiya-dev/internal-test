import { useQuery } from "react-query";
import { getWorkerProfile } from "../services/getWorkerProfile";

export const useGetWorkerProfile = (workerId, bookingId) => {
  return useQuery("getWorkerProfile", () =>
    getWorkerProfile(workerId, bookingId)
  );
};
