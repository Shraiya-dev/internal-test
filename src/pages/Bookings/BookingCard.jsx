import { Box, Button, Chip, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { PopAlert } from '../../components/Snackbar'
import { CTAMap } from '../../utils/ctaHelpers'
import useBookingAction from './hooks/useBookingAction'

const BookingCard = ({ bookingData }) => {
	const navigate = useNavigate()
	const { confirmBooking, sncBar, startAllocation, closeAllocation, markAsRTD, markAsDeployed, startProject } =
		useBookingAction(bookingData)
	const allowedActions = useMemo(() => CTAMap[bookingData.status.enumValue]?.actions, [bookingData])
	const allowedTabs = useMemo(() => CTAMap[bookingData.status.enumValue]?.tabs, [bookingData])
	const [confirmDialogProps, setConfirmDialogProps] = useState({
		content: '',
		open: false,
		cancel: () => {},
		confirm: () => {},
	})
	const closeDialog = useCallback(() => {
		setConfirmDialogProps({})
	}, [])
	const totalPeopleRequired = useMemo(
		() => Object.values(bookingData?.peopleRequired).reduce((prev, next) => Number(prev) + Number(next)),
		[bookingData]
	)

	return (
		<>
			<ConfirmationDialog {...confirmDialogProps} />
			<Paper
				variant="outlined"
				sx={{ borderRadius: 1 }}
				style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Box>
					<Box display="flex" justifyContent="space-between">
						<Typography variant="h6" fontWeight={600}>
							{bookingData.jobType} ({totalPeopleRequired})
						</Typography>
						<Chip
							sx={(theme) => ({ backgroundColor: theme.palette.grey[200], height: '24px' })}
							label={bookingData.status.enumLabel}
						/>
					</Box>
					<Box display="flex" justifyContent="space-between">
						<Typography sx={(theme) => ({ color: theme.palette.grey[700] })} variant="caption">
							ID : {bookingData.bookingId}
						</Typography>
						<Typography sx={(theme) => ({ color: theme.palette.grey[700] })} variant="caption">
							Created on {bookingData.createdOn}
						</Typography>
					</Box>
				</Box>

				{allowedTabs && (
					<>
						{/* <Divider style={{ margin: '16px 0' }} /> */}

						<Box mt={2} mb={2} display="flex">
							{Object.keys(allowedTabs).map((item) => {
								const [state] = bookingData.jobCardsStateCount.filter((obj) => obj.enumValue === item)
								return (
									<Paper
										key={item}
										sx={(theme) => ({
											backgroundColor: theme.palette.grey[100],
											mr: 2,
											p: 2,
											cursor: 'pointer',
										})}>
										<Typography variant="h5" align="center">
											{state.count}
											{item === 'DEPLOYMENT_COMPLETE' && <>/{totalPeopleRequired}</>}
										</Typography>

										<Typography
											sx={(theme) => ({
												color: theme.palette.grey[700],
											})}
											align="center">
											{state.enumLabel}
										</Typography>
									</Paper>
								)
							})}
						</Box>
						{/* <Divider style={{ margin: '16px 0' }} /> */}
					</>
				)}
				<Box pt={1} display="flex" justifyContent="space-between">
					<Box>
						{Object.keys(bookingData.peopleRequired).map((item) => {
							return (
								<Box pb={1} pt={1} display="flex" alignItems="center" key={item}>
									{item.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}: {bookingData.peopleRequired[item]}
								</Box>
							)
						})}
					</Box>
					<Box style={{ maxWidth: '50%', overflow: 'hidden' }}>
						{/* <Box p={1} display="flex" alignItems="center">
							<AccessTime />
							&nbsp;&nbsp;Shift Timing {bookingData.shiftTime}
						</Box> */}
						{/* <Box p={1} display="flex" alignItems="center">
							<AccessTime />
							&nbsp;&nbsp;{bookingData.schedule.bookingDuration}
						</Box> */}
						<Box pb={1} pt={1} display="flex" alignItems="center">
							Company: {bookingData.cmpName}
						</Box>
						<Box pb={1} pt={1} display="flex" alignItems="center">
							Site Address: {bookingData.siteAddress}
						</Box>
						<Box pb={1} pt={1} display="flex" alignItems="center">
							Location: {bookingData.city}, {bookingData.state}
						</Box>
					</Box>
				</Box>
				<Divider style={{ margin: '16px 0' }} />
				<Box display="flex" justifyContent="flex-end">
					{allowedActions && (
						<>
							{allowedActions.view && (
								<Button
									variant="outlined"
									onClick={() => {
										navigate(`/bookings/${bookingData.bookingId}`)
									}}>
									View Booking
								</Button>
							)}
							{/* <Box
								display="flex"
								sx={{
									'&>*': {
										marginLeft: '10px',
									},
								}}>
								{allowedActions.edit && (
									<Button
										variant="contained"
										onClick={() => {
											navigate(`/bookings/${bookingData.bookingId}/detail?edit=true`)
										}}>
										Edit Booking
									</Button>
								)}
								{allowedActions.confirm && (
									<Button
										variant="contained"
										disabled={!bookingData.isConfirmationReady}
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

								{allowedActions.jobCards && (
									<Button
										variant="contained"
										onClick={() => {
											navigate(`/bookings/${bookingData.bookingId}/job-cards/${Object.keys(allowedTabs)[0]}`)
										}}>
										Manage Job cards
									</Button>
								)}

								{allowedActions.startAllocation && (
									<Button
										variant="contained"
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
								{allowedActions.closeAllocation && (
									<Button
										variant="contained"
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
								{allowedActions.rtd && (
									<Button
										variant="contained"
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

								{allowedActions.deploy && (
									<Button
										variant="contained"
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
								{allowedActions.startProject && (
									<Button
										variant="contained"
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
								{allowedActions.attendance && (
									<Button
										variant="contained"
										onClick={() => {
											// navigate(`/booking/${bookingData.bookingId}/job-cards/applied`)
										}}>
										Manage Attendance
									</Button>
								)} 
							</Box>
							*/}
						</>
					)}
				</Box>
			</Paper>
			{/* )} */}
			<PopAlert {...sncBar} />
		</>
	)
}

export default BookingCard
