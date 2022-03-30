import { TabContext, TabPanel } from '@material-ui/lab'
import { KeyboardBackspace } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert } from '../../components/Snackbar'
import { useBooking } from '../../providers/BookingProvider'
import { capitalize } from '../../utils'
import { CTAMap } from '../../utils/ctaHelpers'
import JobCards from '../jobCards/JobCards'
import BookingForm from './BookingForm'

const BookingById = () => {
	// const { booking, handelTabChange, selectedTab } = useBookingById()
	const {
		handelTabChange,
		selectedTab,
		booking,
		sncBar,
		confirmBooking,
		startAllocation,
		closeAllocation,
		markAsRTD,
		markAsDeployed,
		startProject,
	} = useBooking()
	const [confirmDialogProps, setConfirmDialogProps] = useState({
		content: '',
		open: false,
		cancel: () => {},
		confirm: () => {},
	})

	const allowedActions = useMemo(() => CTAMap[booking?.status]?.actions, [booking])
	const allowedTabs = useMemo(() => CTAMap[booking?.status]?.tabs, [booking])
	const closeDialog = useCallback(() => {
		setConfirmDialogProps({})
	}, [])
	const navigate = useNavigate()

	return (
		<>
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
								color="inherit">
								<KeyboardBackspace
									fontSize="inherit"
									sx={{
										fontSize: '32px',
									}}
								/>
							</IconButton>
							<Stack>
								<Typography variant="h4" fontWeight={600}>
									{booking?.jobType
										.split('_')
										.map((item) => capitalize(item))
										.join(' ')}
									<Chip sx={{ ml: 2 }} label={booking?.status} />
								</Typography>
								<Typography variant="caption" fontWeight={400}>
									ID: {booking?.bookingId}
								</Typography>
							</Stack>
						</Stack>
						<Stack justifyContent="flex-end" alignItems="flex-end">
							<Stack direction="row" justifyContent="flex-end">
								{allowedActions?.confirm && (
									<Button
										variant="contained"
										sx={{
											height: 48,
										}}
										disabled={!booking.isConfirmationReady}
										onClick={() =>
											setConfirmDialogProps({
												open: true,
												content: (
													<>
														Move booking to<strong> Confirmation </strong>state?
													</>
												),
												cancel: closeDialog,
												confirm: () => {
													confirmBooking()
													closeDialog()
												},
											})
										}>
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
										}}>
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
										}}>
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
										}}>
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
										}}>
										Make Booking Deployed
									</Button>
								)}
								{allowedActions?.startProject && !booking?.generateEarnings && (
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
										}}>
										Start Project
									</Button>
								)}
								{allowedActions?.attendance && booking?.generateEarnings && (
									<Button
										variant="contained"
										sx={{
											height: 48,
										}}
										onClick={() => {
											navigate(`/bookings/${booking.bookingId}/attendance`)
										}}>
										Manage Attendance
									</Button>
								)}
							</Stack>
							{booking?.status === 'ALLOCATION_IN_PROGRESS' && (
								<Typography
									sx={{
										mt: 1,
									}}
									fontSize={12}
									color="red"
									fontStyle="italic"
									align="right">
									Close allocation within 72 hours
								</Typography>
							)}
							{booking?.status === 'ALLOCATION_CLOSED' && (
								<Typography
									sx={{
										mt: 1,
									}}
									fontSize={12}
									color="red"
									fontStyle="italic"
									align="right">
									Mark booking as RTD within 48 hours
								</Typography>
							)}
						</Stack>
					</Stack>
					<TabContext value={selectedTab}>
						<Tabs
							TabIndicatorProps={{
								style: {
									height: '3px',
								},
							}}
							value={selectedTab}
							onChange={handelTabChange}>
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
							}}>
							<BookingForm />
						</TabPanel>
						<TabPanel
							value="allocation"
							style={{
								height: 'calc( 100vh - 270px )',
								overflowY: 'auto',
								position: 'relative',
							}}>
							{booking && <JobCards />}
						</TabPanel>
					</TabContext>
				</Paper>
			</DashboardLayout>
			<ConfirmationDialog {...confirmDialogProps} />
			<PopAlert {...sncBar} />
		</>
	)
}

export default BookingById