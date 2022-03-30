import { Search } from '@mui/icons-material'
import { Box, Button, Grid, LinearProgress, Typography, MenuItem, Paper, Select, Stack, TextField } from '@mui/material'
import React from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert } from '../../components/Snackbar'
import { StatusCard } from '../CustomerBookings/components/StatusCard'
import BookingCard from './BookingCard'
import { useBooking } from './hooks/useBooking'

const selectOption = [
	{
		label: 'Select Status',
		value: 'none',
	},
	{ label: 'Received', value: 'RECEIVED' },
	{ label: 'Confirmed', value: 'CONFIRMED' },
	{ label: 'Allocation pending', value: 'ALLOCATION_PENDING' },
	{ label: 'Allocation In Progress', value: 'ALLOCATION_IN_PROGRESS' },
	{ label: 'Allocation Closed', value: 'ALLOCATION_CLOSED' },
	{ label: 'RTD', value: 'READY_TO_DEPLOY' },
	{ label: 'Deployed', value: 'DEPLOYED' },
	// { label: 'Closed', value: 'CLOSED' },
	{ label: 'Cancelled', value: 'CANCELLED' },
]

const Bookings = () => {
	const { form, checkError, bookings, setSncBar, sncBar, isLoading } = useBooking()
	return (
		<>
			<DashboardLayout>
				<Paper variant="outlined">
					<form onSubmit={form.handleSubmit}>
						<Box p={2} display="flex" justifyContent="flex-start" alignItems="stretch">
							<Select
								variant="outlined"
								sx={{
									width: '200px',
									marginRight: 2,
								}}
								value={form.values.bookingStatus}
								onChange={(e) => {
									form.setFieldValue('bookingStatus', e.target.value)
								}}>
								{selectOption.map((opt) => {
									return (
										<MenuItem key={opt.value} value={opt.value}>
											{opt.label}
										</MenuItem>
									)
								})}
							</Select>
							<TextField
								name="customerNumber"
								error={!!checkError('customerNumber')}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
								value={form.values.customerNumber}
								sx={{
									width: '300px',
									marginRight: 2,
								}}
								variant="outlined"
								label="Customer's phone number"
							/>
							<Button type="submit" color="primary" startIcon={<Search />} variant="contained">
								search
							</Button>
						</Box>
					</form>
				</Paper>
				{isLoading ? (
					<Box
						sx={{
							margin: '35vh auto',
							width: '50%',
						}}>
						<LinearProgress />
					</Box>
				) : (
					<Box pt={2}>
						{bookings?.length === 0 && (
							<Typography
								variant="h5"
								sx={{
									margin: '30% auto',
								}}
								color="#616161">
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
									<Grid style={{ display: 'flex' }} key={bookingData?.bookingId} item lg={4} md={6}>
										<BookingCard bookingData={bookingData} />
									</Grid>
								)
							})}
						</Grid>
					</Box>
				)}
			</DashboardLayout>
			<PopAlert {...sncBar} />
		</>
	)
}

export default Bookings
