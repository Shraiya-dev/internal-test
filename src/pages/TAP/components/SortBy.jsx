import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

export const SortBy = () => {
  const [sortBy, setSortBy] = useState("");

  const onSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  let sortByOptions = ["A-Z", "Latest First"];

  return (
    <FormControl fullWidth>
      <FormLabel style={{ marginBottom: "0.25rem" }}>{"Sort By"}</FormLabel>
      <Select
        labelId="sortby-label"
        id="sortby"
        value={sortBy}
        onChange={onSortByChange}
        variant="outlined"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {sortByOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
