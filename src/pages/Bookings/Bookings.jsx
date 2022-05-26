import { Search } from '@mui/icons-material'
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    LinearProgress,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { QueryField, QueryMultiSelect, QueryReset, QuerySelect } from '../../components/queryInputs'
import { BookingStates, JobTypeOptions } from '../../constant/booking'
import { getSelectOptions } from '../../utils/InputHelpers'
import { StatusCard } from '../CustomerBookings/components/StatusCard'
import BookingCard from './BookingCard'
import { useBookings } from './hooks/useBooking'

const Bookings = () => {
    const { bookings, hasMore, isLoading, getBookings } = useBookings()
    const [searchParams, setSearchParams] = useSearchParams()
    return (
        <>
            <DashboardLayout>
                <Paper variant="outlined">
                    <Stack p={2} direction="row" spacing={2}>
                        <QueryMultiSelect sx={{ width: 200 }} name="status" options={BookingStates} />
                        <QueryMultiSelect sx={{ width: 200 }} name="jobType" options={JobTypeOptions} />

                        <QueryField
                            label="Customer Phone"
                            validation={(val) => val.length <= 10 && !isNaN(Number(val))}
                            sx={{ width: 200 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            placeholder="Enter Phone Number"
                            name="customerNumber"
                            error={searchParams.get('customerNumber') && searchParams.get('customerNumber').length < 10}
                        />
                        <QueryField
                            label="Project Id"
                            sx={{ width: 200 }}
                            placeholder="Enter Project Id"
                            name="projectId"
                        />

                        <QueryField
                            sx={{ width: 200 }}
                            label="Booking Id"
                            placeholder="Enter Booking Id"
                            name="bookingId"
                        />
                        <Button
                            onClick={() => getBookings(searchParams)}
                            color="primary"
                            startIcon={<Search />}
                            variant="contained"
                        >
                            search
                        </Button>
                        <QueryReset>Clear Filters</QueryReset>
                    </Stack>
                </Paper>
                <Stack mt={2} direction="row" alignItems="center" justifyContent="flex-end">
                    Bookings: {bookings.length}
                    <Pagination
                        page={searchParams.get('pageNumber') ? Number(searchParams.get('pageNumber')) : 1}
                        hideNextButton={!hasMore}
                        count={hasMore ? 35 : Number(searchParams.get('pageNumber'))}
                        siblingCount={0}
                        disabled={isLoading}
                        boundaryCount={0}
                        showFirstButton={false}
                        showLastButton={false}
                        color="primary"
                        onChange={(e, page) => {
                            searchParams.set('pageNumber', page)
                            setSearchParams(searchParams)
                        }}
                    />
                </Stack>
                {isLoading ? (
                    <Box
                        sx={{
                            margin: '35vh auto',
                            width: '50%',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                ) : (
                    <Box pt={2}>
                        {bookings?.length === 0 && (
                            <Typography
                                variant="h5"
                                sx={{
                                    margin: '10% auto',
                                    width: 'fit-content',
                                }}
                                color="#616161"
                            >
                                No bookings found in this state
                            </Typography>
                        )}
                        <Grid container alignItems="stretch" spacing={1.5}>
                            {bookings?.map((bookingData, index) => {
                                return bookingData?.legacyBooking ? (
                                    <Grid style={{ display: 'flex' }} key={bookingData?._id} item lg={4} md={6}>
                                        <StatusCard booking={bookingData} />
                                    </Grid>
                                ) : (
                                    <Grid
                                        style={{ display: 'flex' }}
                                        key={bookingData?.booking?.bookingId}
                                        item
                                        lg={4}
                                        md={6}
                                    >
                                        <BookingCard bookingData={bookingData} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box>
                )}
            </DashboardLayout>
        </>
    )
}

export default Bookings
