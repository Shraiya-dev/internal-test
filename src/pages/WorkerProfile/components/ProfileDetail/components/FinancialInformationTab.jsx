import React from "react";
import { Box } from "@material-ui/core";
import { BankDetails } from "./BankDetails";
import { Identifications } from "./Identifications";
// import { useQuery } from "react-query";
// import { useParams } from "react-router";
// import { getFinancialData } from "../../../../../services";
// import { NotKnown } from "./NotKnown";
// import { Loader } from "../../../../../components";
// import { Error } from "../../../../../components";
// import { extractResponse } from "../../../../../utils";

export const FinancialInformationTab = ({ worker }) => {
  // const { workerId } = useParams();
  // const { isLoading, data, error } = useQuery("/financialDataTab", () =>
  //   getFinancialData(workerId)
  // );

  // if (isLoading) {
  //   return <Loader />;
  // }

  // if (error) {
  //   return <Error error={error} />;
  // }

  // const res = extractResponse(data);

  // if (res?.error) {
  //   return <Error error={res?.error} />;
  // }

  // const financialData = res?.data;
  // console.log(financialData);
  return (
    <Box
      px={2}
      pb={2}
      sx={{
        minHeight: "475px",
      }}
    >
      <BankDetails bankDetails={worker?.bankDetails} />
      <Identifications doc={worker?.doc} />
    </Box>
  );
};
