import { useQuery } from "react-query";
import { getCustomerBookings } from "../services";

export const useGetCustomerBookings = (phoneNumber) => {
  return useQuery(
    "getCustomerBookingsFromPhoneNumber",
    () => getCustomerBookings(phoneNumber),
    {
      enabled: false,
    }
  );
};
