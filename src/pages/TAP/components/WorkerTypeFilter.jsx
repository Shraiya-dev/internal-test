import React, { useState } from "react";
import { FormControl, FormLabel, Select, MenuItem } from "@material-ui/core";

export const WorkerTypeFilter = () => {
  const [workerType, setWorkerType] = useState("");
  const workerTypes = ["Helper", "Techinician", "Supervisor"];
  const onWorkerTypeChange = (e) => setWorkerType(e.target.value);

  return (
    <FormControl fullWidth>
      <FormLabel style={{ marginBottom: "0.25rem" }}>{"Worker Type"}</FormLabel>
      <Select
        labelId="job-type-label"
        id="job-type"
        value={workerType}
        onChange={onWorkerTypeChange}
        variant="outlined"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {workerTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
