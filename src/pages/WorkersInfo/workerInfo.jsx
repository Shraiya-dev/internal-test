import { useCallback, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, TextField, Button, Paper, Select, MenuItem, Typography, Stack } from '@mui/material'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useWorkerInfo } from './hooks/useWorkerInfo'
import { getSelectOptions } from '../../utils/InputHelpers'
import { cities, states } from '../../utils/data'
import { Search } from '@material-ui/icons'
import { jobTypeOptions } from '../workers/helper'
import { ADD_WORKER_ROUTE } from '../../routes'
import { FourMpRounded } from '@mui/icons-material'

export default function DataTable() {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	let params = new URL(document.location).searchParams

	const addWorkers = useCallback(() => {
		navigate(ADD_WORKER_ROUTE, {
			state: {
				from: pathname,
			},
		})
	}, [navigate, pathname])

	const viewWorkerInfo = useCallback(
		(workerInfo) => {
			navigate(`/workers/${workerInfo?.id}/`, {
				state: {
					from: pathname,
				},
			})
		},
		[navigate, pathname]
	)

	const columns = [
		// { field: 'id', headerName: <h4>ID</h4>, width: 220 },

		{ field: 'name', headerName: <h4>Name</h4>, width: 150 },
		{
			field: 'phoneNumber',
			headerName: <h4>Phone Number</h4>,
			width: 150,
		},
		{
			field: 'jobType',
			headerName: <h4>JobType</h4>,
			width: 150,
		},
		{
			field: 'skillType',
			headerName: <h4>Skill type</h4>,
			width: 150,
		},
		{ field: 'status', headerName: <h4>Status</h4>, width: 220 },
		{
			field: 'bookingId',
			headerName: <h4>Booking ID</h4>,
			width: 150,
			renderCell: (params) => (
				<Link
					style={{
						textDecoration: 'underline',
						color: '#244CB3',
					}}
					to={`/bookings/${params?.row.bookingId}`}>
					{params?.row?.bookingId}
				</Link>
			),
		},
		{ field: 'state', headerName: <h4>State</h4>, width: 150 },
		{
			field: 'city',
			headerName: <h4>City</h4>,
			width: 150,
		},

		{
			field: 'action',
			headerName: <h4>Action</h4>,
			sortable: false,
			width: 100,

			renderCell: (params) => (
				<Button onClick={() => viewWorkerInfo(params)} variant="outlined">
					View
				</Button>
			),
		},
	]

	const { checkError, form, workerData } = useWorkerInfo()
	// console.log(workerData)
	return (
		<DashboardLayout>
			<Box display="flex" justifyContent="space-between" alignItems={'center'}>
				<Typography variant="h4" fontWeight={600} align="center">
					Manage Workers
				</Typography>
				<Button
					sx={{
						mb: 2,
						height: 48,
					}}
					variant="outlined"
					onClick={addWorkers}>
					Add Worker
				</Button>
			</Box>
			<Paper>
				<form onSubmit={form.handleSubmit}>
					<Stack
						direction="row"
						p={2}
						sx={{
							'&>*': {
								mr: '8px !important',
								width: 200,
							},
						}}>
						<TextField
							name="workerName"
							error={!!checkError('workerName')}
							value={form.values.workerName}
							onChange={(e) => {
								form.setFieldValue('workerName', e.target.value)
							}}
							onBlur={form.handleBlur}
							variant="outlined"
							label="Search Worker Name"
						/>

						<Select
							variant="outlined"
							name="state"
							value={form.values.state}
							onChange={(e) => {
								form.setFieldValue('city', 'none')
								form.handleChange(e)
							}}>
							<MenuItem value={'none'}>Select State</MenuItem>
							{getSelectOptions(states) ?? []}
						</Select>

						<Select
							name="city"
							variant="outlined"
							disabled={form.values.state === 'none'}
							value={form.values.city}
							onChange={form.handleChange}>
							<MenuItem value={'none'}>Select city</MenuItem>
							{getSelectOptions(cities[form.values.state] ?? [])}
						</Select>

						<Select name="jobType" variant="outlined" value={form.values.jobType} onChange={form.handleChange}>
							<MenuItem value={'none'}>Job Type</MenuItem>
							{getSelectOptions(jobTypeOptions)}
						</Select>

						<TextField
							name="phone"
							error={!!checkError('phone')}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
							variant="outlined"
							label="Search By Phone"
							value={form.values.phone}
						/>
						<Button type="submit" startIcon={<Search />} color="primary" variant="contained">
							search
						</Button>
					</Stack>
				</form>
			</Paper>

			<Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
				<DataGrid rows={workerData} columns={columns} pageSize={20} />
			</Paper>
		</DashboardLayout>
	)
}
