import React from 'react'
import { Box } from '@material-ui/core'
import { InfoWithDescription } from './InfoWithDescription'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getWorkProfile } from '../../../services/getWorkProfile'
import { extractResponse } from '../../../../../utils'
import { Loader } from '../../../../../components'
import { NotKnown } from './NotKnown'

export const WorkProfileTab = () => {
    const { workerId, bookingId } = useParams()
    const { isLoading, data, error } = useQuery('/workerprofiletab', () => getWorkProfile(workerId, bookingId))

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <p>{error?.message}</p>
    }

    const res = extractResponse(data)

    if (res?.error) {
        return <p>{res?.error}</p>
    }

    const workDetails = res?.data

    return (
        <Box
            p={2}
            pb={2}
            pt={0}
            sx={{
                minHeight: '475px',
                // border: "solid 1px red",
            }}
        >
            <Box pb={2}>
                {workDetails?.length === 0 && <NotKnown message={'Not Available'} />}
                {workDetails?.length > 0 &&
                    workDetails?.map((work, id) => (
                        <InfoWithDescription
                            key={id}
                            title={work.title}
                            duration={work.dateRange} //(2 years 3 months) implement total duration calculator
                        />
                    ))}
            </Box>
        </Box>
    )
}
