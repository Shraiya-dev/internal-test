import React, { useState } from 'react'
import { FormControl, FormLabel, Select, FormHelperText, MenuItem } from '@material-ui/core'
import { useQuery } from 'react-query'
import { getJobTypes } from '../services/getJobTypes'
import { extractResponse } from '../../../utils'

export const JobTypeFilter = () => {
    const [jobType, setJobType] = useState('')

    const { data } = useQuery('getJobTypes', getJobTypes)

    const res = extractResponse(data)

    const onJobTypeChange = (e) => {
        setJobType(e.target.value)
    }

    let jobTypes = []

    if (res?.data) {
        jobTypes = res?.data
    }

    console.log(jobTypes)

    return (
        <FormControl fullWidth>
            <FormLabel style={{ marginBottom: '0.25rem' }}>{'Job Type'}</FormLabel>
            <Select
                labelId="job-type-label"
                id="job-type"
                value={jobType}
                onChange={onJobTypeChange}
                variant="outlined"
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {jobTypes.map((jobType) => (
                    <MenuItem key={jobType.jtKey} value={jobType.jtKey}>
                        {jobType.jtValue}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
