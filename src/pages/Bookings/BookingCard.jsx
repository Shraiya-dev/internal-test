import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CTAMap } from '../../utils/ctaHelpers'
import { formatEnum } from '../../utils/stringHelpers'

const BookingCard = ({ bookingData }) => {
    const { booking, project, customer, stats } = bookingData
    const allowedActions = useMemo(() => CTAMap[booking?.status]?.actions, [booking])
    const allowedTabs = useMemo(() => CTAMap[booking?.status]?.tabs, [booking])
    const totalPeopleRequired = useMemo(
        () => Object.values(booking?.peopleRequired)?.reduce((prev, next) => Number(prev) + Number(next)),
        [booking]
    )

    return (
        <>
            <Paper
                variant="outlined"
                sx={{ borderRadius: 1 }}
                style={{
                    padding: '16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600}>
                            {formatEnum(booking?.jobType)} ({totalPeopleRequired})
                        </Typography>
                        <Chip
                            sx={(theme) => ({
                                backgroundColor: theme.palette.grey[200],
                                height: '24px',
                            })}
                            label={formatEnum(booking?.status)}
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography sx={(theme) => ({ color: theme.palette.grey[700] })} variant="caption">
                            ID : {booking?._id}
                        </Typography>
                        <Typography sx={(theme) => ({ color: theme.palette.grey[700] })} variant="caption">
                            Created on {new Date(booking?.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                </Box>

                {allowedTabs && stats?.jobCardCounts && (
                    <Stack direction="row" flexWrap="wrap">
                        {Object.keys(allowedTabs).map((item) => {
                            const state = stats?.jobCardCounts[item]
                            return (
                                <Paper
                                    key={item}
                                    sx={(theme) => ({
                                        backgroundColor: theme.palette.grey[100],
                                        p: 2,
                                        m: 1,
                                        cursor: 'pointer',
                                    })}
                                >
                                    <Typography variant="h6" align="center">
                                        {(state?.HELPER ?? 0) + (state?.TECHNICIAN ?? 0) + (state?.SUPERVISOR ?? 0)}
                                        {item === 'DEPLOYMENT_COMPLETE' && <>/{totalPeopleRequired}</>}
                                    </Typography>

                                    <Typography
                                        sx={(theme) => ({
                                            color: theme.palette.grey[700],
                                        })}
                                        align="center"
                                    >
                                        {formatEnum(item)}
                                    </Typography>
                                </Paper>
                            )
                        })}
                    </Stack>
                )}
                <Box pt={1} display="flex" justifyContent="space-between">
                    <Box>
                        {Object.keys(booking?.peopleRequired).map((item) => {
                            return (
                                <Box pb={1} pt={1} display="flex" alignItems="center" key={item}>
                                    {formatEnum(item)}: {booking?.peopleRequired[item]}
                                </Box>
                            )
                        })}
                    </Box>
                    <Box style={{ maxWidth: '50%', overflow: 'hidden' }}>
                        <Box pb={1} pt={1} display="flex" sx={{ wordBreak: 'break-word' }} alignItems="center">
                            Project: {project?.name}
                        </Box>
                        <Box pb={1} pt={1} display="flex" sx={{ wordBreak: 'break-word' }} alignItems="center">
                            Company: {customer?.companyName}
                        </Box>
                        <Box pb={1} pt={1} display="flex" sx={{ wordBreak: 'break-word' }} alignItems="center">
                            Location: {project?.city}, {project?.state}
                        </Box>
                    </Box>
                </Box>
                <Divider style={{ margin: '16px 0' }} />
                <Box display="flex" justifyContent="flex-end">
                    {allowedActions && (
                        <>
                            {allowedActions.view && (
                                <Link to={`/bookings/${booking?._id}`}>
                                    <Button variant="outlined">View Booking</Button>
                                </Link>
                            )}
                        </>
                    )}
                </Box>
            </Paper>
        </>
    )
}

export default BookingCard
