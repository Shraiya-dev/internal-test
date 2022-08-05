import { TabContext, TabPanel } from '@material-ui/lab'
import { KeyboardBackspace } from '@mui/icons-material'
import { Button, Chip, IconButton, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CancelBookingConfirmationDialog from '../../components/CancelBookingConfirmationDialog'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useBooking } from '../../providers/BookingProvider'
import { CTAMap } from '../../utils/ctaHelpers'
import { formatEnum } from '../../utils/stringHelpers'
import JobCards from '../jobCards/JobCards'
import BookingForm from './BookingForm'

const BookingById = () => {
    const {
        handelTabChange,
        booking,
        project,
        customer,
        confirmBooking,
        startAllocation,
        closeAllocation,
        markAsRTD,
        markAsDeployed,
        startProject,
        timer,
        cancelBooking,
        createDuplicateBookings,
    } = useBooking()
    const [confirmDialogProps, setConfirmDialogProps] = useState({
        content: '',
        open: false,
        cancel: () => {},
        confirm: () => {},
    })
    const allowedActions = useMemo(() => CTAMap[booking?.status]?.actions, [booking])
    const [cancelBookingConfirmationDialogProps, setCancelBookingConfirmationDialogProps] = useState({
        open: false,
        cancel: () => {},
        confirm: () => {},
    })
    const closeDialog = useCallback(() => {
        setConfirmDialogProps({})
        setCancelBookingConfirmationDialogProps({})
    }, [])
    const [sp, setSp] = useSearchParams()
    const navigate = useNavigate()

    return (
        <>
            <CancelBookingConfirmationDialog {...cancelBookingConfirmationDialogProps} />

            <DashboardLayout>
                <Paper sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="stretch" justifyContent="space-between">
                        <Stack direction="row" alignItems="center">
                            <IconButton
                                onClick={() => {
                                    navigate(-1)
                                }}
                                sx={{
                                    p: 0,
                                    mr: 2,
                                }}
                                color="inherit"
                            >
                                <KeyboardBackspace
                                    fontSize="inherit"
                                    sx={{
                                        fontSize: '32px',
                                    }}
                                />
                            </IconButton>
                            <Stack>
                                <Typography variant="h4" fontWeight={600}>
                                    {formatEnum(booking?.jobType)}
                                    <Chip
                                        sx={(theme) => ({
                                            backgroundColor: booking?.bookingType === 'LIMITED_DISCOVERY' ? theme.palette.grey[500] : theme.palette.primary.light,
                                            color: theme.palette.primary.contrastText,
                                            ml: 2,
                                        })}
                                        label={booking?.bookingType || 'FPH'}
                                    />
                                    <Chip sx={{ ml: 2 }} label={booking?.status} />
                                    {booking?.parentBookingId && (
                                        <Chip
                                            sx={{ ml: 2 }}
                                            label={
                                                <>
                                                    Parent Booking:
                                                    <Link to={`/bookings/${booking?.parentBookingId}`}>
                                                        <Typography
                                                            sx={{
                                                                textDecoration: 'underline',
                                                            }}
                                                            variant="caption"
                                                            component="span"
                                                            color="primary.main"
                                                        >
                                                            {booking?.parentBookingId}
                                                        </Typography>
                                                    </Link>
                                                </>
                                            }
                                        />
                                    )}
                                </Typography>
                                <Typography variant="caption" fontWeight={400}>
                                    ID: {booking?._id}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack justifyContent="flex-end" alignItems="flex-end">
                            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                {allowedActions?.cancel && (
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() =>
                                            setCancelBookingConfirmationDialogProps({
                                                open: true,
                                                cancel: closeDialog,
                                                confirm: (value) => {
                                                    cancelBooking(value)
                                                    closeDialog()
                                                },
                                            })
                                        }
                                    >
                                        Cancel Booking
                                    </Button>
                                )}
                                {allowedActions?.duplicate && (
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() =>
                                            setConfirmDialogProps({
                                                open: true,
                                                content: (
                                                    <>
                                                        This action will<strong> Duplicate </strong>this booking.
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    createDuplicateBookings()
                                                    closeDialog()
                                                },
                                            })
                                        }
                                    >
                                        Duplicate Booking
                                    </Button>
                                )}
                                {allowedActions?.confirm && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() =>
                                            setConfirmDialogProps({
                                                open: true,
                                                content: (
                                                    <>
                                                        <Typography variant="h6">
                                                            Move booking to<strong> Confirmation </strong>state?
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            Please verify the project details{' '}
                                                            <Link to={`/projects/${project?._id}?`}>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{ textDecoration: 'underline' }}
                                                                    color="primary.main"
                                                                >
                                                                    {project?.name}
                                                                </Typography>
                                                            </Link>{' '}
                                                            before confirming the booking
                                                        </Typography>
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    confirmBooking()
                                                    closeDialog()
                                                },
                                            })
                                        }
                                    >
                                        Confirm Booking
                                    </Button>
                                )}

                                {allowedActions?.startAllocation && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() => {
                                            setConfirmDialogProps({
                                                open: true,
                                                content: (
                                                    <>
                                                        Move booking to<strong> Allocation-in-progress </strong>state?
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    startAllocation()
                                                    closeDialog()
                                                },
                                            })
                                        }}
                                    >
                                        Start Allocation
                                    </Button>
                                )}
                                {allowedActions?.closeAllocation && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() => {
                                            setConfirmDialogProps({
                                                open: true,
                                                content: (
                                                    <>
                                                        Move booking to<strong> Allocation Closed </strong>state?
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    closeAllocation()
                                                    closeDialog()
                                                },
                                            })
                                        }}
                                    >
                                        Close Allocation
                                    </Button>
                                )}
                                {allowedActions?.rtd && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() => {
                                            setConfirmDialogProps({
                                                open: true,
                                                content: (
                                                    <>
                                                        Move booking to<strong> Ready To Deployment </strong>state?
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    markAsRTD()
                                                    closeDialog()
                                                },
                                            })
                                        }}
                                    >
                                        Make Booking RTD
                                    </Button>
                                )}

                                {allowedActions?.deploy && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() => {
                                            setConfirmDialogProps({
                                                open: true,
                                                content: (
                                                    <>
                                                        Move booking to<strong> Deployed </strong>state?
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    markAsDeployed()
                                                    closeDialog()
                                                },
                                            })
                                        }}
                                    >
                                        Make Booking Deployed
                                    </Button>
                                )}
                                {allowedActions?.startProject && !project?.generateEarnings && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 48,
                                        }}
                                        onClick={() => {
                                            setConfirmDialogProps({
                                                open: true,
                                                content: 'Start project for this booking?',
                                                cancel: closeDialog,
                                                confirm: () => {
                                                    startProject()
                                                    closeDialog()
                                                },
                                            })
                                        }}
                                    >
                                        Start Project
                                    </Button>
                                )}
                                {allowedActions?.attendance && project?.generateEarnings && (
                                    <Link to={`/attendance?projectId=${project._id}`}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                height: 48,
                                            }}
                                        >
                                            Manage Attendance
                                        </Button>
                                    </Link>
                                )}
                                {allowedActions?.manageEmployees && project?.generateEarnings && (
                                    <Link to={`/projects/${project?._id}?tab=employee`}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                height: 48,
                                            }}
                                        >
                                            Manage Employees
                                        </Button>
                                    </Link>
                                )}
                            </Stack>
                            {booking?.status.enumValue === 'ALLOCATION_IN_PROGRESS' && (
                                <Typography
                                    sx={{
                                        mt: 1,
                                    }}
                                    fontSize={12}
                                    color="red"
                                    fontStyle="italic"
                                    align="right"
                                >
                                    Time remaining to close Allocation: {`${timer.hours} Hrs ${timer.minutes} Mins`}
                                </Typography>
                            )}
                            {booking?.status.enumValue === 'ALLOCATION_CLOSED' && (
                                <Typography
                                    sx={{
                                        mt: 1,
                                    }}
                                    fontSize={12}
                                    color="red"
                                    fontStyle="italic"
                                    align="right"
                                >
                                    Time remaining to mark booking RTD: {`${timer.hours} Hrs ${timer.minutes} Mins`}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                    <TabContext value={sp.get('tab') ?? 'info'}>
                        <Tabs
                            TabIndicatorProps={{
                                style: {
                                    height: '3px',
                                },
                            }}
                            value={sp.get('tab') ?? 'info'}
                            onChange={handelTabChange}
                        >
                            <Tab
                                sx={{
                                    fontSize: '18px',
                                }}
                                value="info"
                                label="Booking Info"
                            />
                            <Tab
                                sx={{
                                    fontSize: '18px',
                                }}
                                value="allocation"
                                label="Manage Allocation"
                            />
                        </Tabs>
                        <TabPanel
                            value="info"
                            style={{
                                height: 'calc( 100vh - 270px )',
                                overflowY: 'auto',
                                position: 'relative',
                            }}
                        >
                            <BookingForm />
                        </TabPanel>
                        <TabPanel
                            value="allocation"
                            style={{
                                height: 'calc( 100vh - 270px )',
                                overflowY: 'auto',
                                position: 'relative',
                                padding: '16px 0',
                            }}
                        >
                            <JobCards />
                        </TabPanel>
                    </TabContext>
                </Paper>
            </DashboardLayout>
            <ConfirmationDialog {...confirmDialogProps} />
        </>
    )
}

export default BookingById
