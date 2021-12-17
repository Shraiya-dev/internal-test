import React, { useState } from "react";
import { FormControl, FormLabel, Select, MenuItem } from "@material-ui/core";

export const StateFilter = () => {
  const [state, setState] = useState("");
  const onStateChange = (e) => setState(e.target.value);

  const states = [
    {
      key: "AN",
      name: "Andaman and Nicobar Islands",
    },
    {
      key: "AP",
      name: "Andhra Pradesh",
    },
    {
      key: "AR",
      name: "Arunachal Pradesh",
    },
    {
      key: "AS",
      name: "Assam",
    },
    {
      key: "BR",
      name: "Bihar",
    },
    {
      key: "CG",
      name: "Chandigarh",
    },
    {
      key: "CH",
      name: "Chhattisgarh",
    },
    {
      key: "DH",
      name: "Dadra and Nagar Haveli",
    },
    {
      key: "DD",
      name: "Daman and Diu",
    },
    {
      key: "DL",
      name: "Delhi",
    },
    {
      key: "GA",
      name: "Goa",
    },
    {
      key: "GJ",
      name: "Gujarat",
    },
    {
      key: "HR",
      name: "Haryana",
    },
    {
      key: "HP",
      name: "Himachal Pradesh",
    },
    {
      key: "JK",
      name: "Jammu and Kashmir",
    },
    {
      key: "JH",
      name: "Jharkhand",
    },
    {
      key: "KA",
      name: "Karnataka",
    },
    {
      key: "KL",
      name: "Kerala",
    },
    {
      key: "LD",
      name: "Lakshadweep",
    },
    {
      key: "MP",
      name: "Madhya Pradesh",
    },
    {
      key: "MH",
      name: "Maharashtra",
    },
    {
      key: "MN",
      name: "Manipur",
    },
    {
      key: "ML",
      name: "Meghalaya",
    },
    {
      key: "MZ",
      name: "Mizoram",
    },
    {
      key: "NL",
      name: "Nagaland",
    },
    {
      key: "OR",
      name: "Odisha",
    },
    {
      key: "PY",
      name: "Puducherry",
    },
    {
      key: "PB",
      name: "Punjab",
    },
    {
      key: "RJ",
      name: "Rajasthan",
    },
    {
      key: "SK",
      name: "Sikkim",
    },
    {
      key: "TN",
      name: "Tamil Nadu",
    },
    {
      key: "TS",
      name: "Telangana",
    },
    {
      key: "TR",
      name: "Tripura",
    },
    {
      key: "UK",
      name: "Uttar Pradesh",
    },
    {
      key: "UP",
      name: "Uttarakhand",
    },
    {
      key: "WB",
      name: "West Bengal",
    },
  ];

  return (
    <FormControl fullWidth>
      <FormLabel style={{ marginBottom: "0.25rem" }}>{"State"}</FormLabel>
      <Select
        labelId="job-type-label"
        id="job-type"
        value={state}
        onChange={onStateChange}
        variant="outlined"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {states.map((state) => (
          <MenuItem key={state.key} value={state.name}>
            {state.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
