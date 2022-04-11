import {
	Button,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material'
import { Backup } from '@material-ui/icons'
import GetApp from '@material-ui/icons/GetApp'
import Publish from '@material-ui/icons/Publish'
import axios from 'axios'
import { format, isAfter } from 'date-fns'
import { useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBackendUrl } from '../../api'
import { FileInput } from '../../components/CustomInputs'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert, setSnackbar } from '../../components/Snackbar'
import { createCsvBlob, retriveDataFromExcel } from '../../utils/fileUtils'
import { isError } from '../../utils/formErrorsChecker'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
	headingContainer: {
		backgroundColor: '#ffffff',
		padding: '30px 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},

	btnContainer: {
		display: 'flex',
		justifyContent: 'center',
	},

	m10: {
		margin: '16px',
	},
}))

const Attendance = () => {
	const [data, setData] = useState([])
	const { bookingId } = useParams()
	const [sncBarProps, setSncBarProps] = useState({
		msg: '',
	})

	const classes = useStyles()
	const form = useFormik({
		initialValues: {
			date: new Date(),
		},
		validate: (values) => {
			const errors = {}
			if (isAfter(values.date, new Date())) {
				errors.date = 'Date selected is invalid'
				setSnackbar(
					{
						msg: 'Invalid Date Selected',
						sev: 'error',
					},
					setSncBarProps
				)
			}
			return errors
		},
		onSubmit: () => {},
	})

	//download .xlsx file from server
	const downloadAttendance = useCallback(async () => {
		const urlParams = new URLSearchParams({
			date: format(form.values.date, 'yyyy-MM-dd'),
			projectId: bookingId,
		})
		try {
			const res = await axios.get(`${getBackendUrl()}/admin/attendance/download?` + urlParams.toString(), {
				responseType: 'blob',
			})

			const url = window.URL.createObjectURL(res.data)
			var a = document.createElement('a')
			a.href = url
			a.download = form.values.date.toLocaleDateString() + '.xlsx'
			document.body.appendChild(a)
			a.click()
			a.remove()
			setSnackbar(
				{
					msg: 'Download Complete',
					sev: 'success',
				},
				setSncBarProps
			)
		} catch (error) {
			setSnackbar(
				{
					msg: 'No Attendance Found For Given Date',
					sev: 'warning',
				},
				setSncBarProps
			)
		}
	}, [form.values.date, bookingId])

	//submit .csv file to server
	const submitAttendance = useCallback(async () => {
		const file = createCsvBlob(data)
		const formData = new FormData()
		formData.append('file', file, form.values.date.toLocaleDateString())
		formData.append('projectId', bookingId)
		formData.append('date', format(form.values.date, 'yyyy-MM-dd'))
		try {
			const res = await axios.put(`${getBackendUrl()}/admin/attendance/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			setSnackbar(
				{
					msg: res.data.data,
					sev: 'success',
				},
				setSncBarProps
			)
		} catch (error) {
			setSnackbar(
				{
					msg: 'Failed to upload file ',
					sev: 'error',
				},
				setSncBarProps
			)
		}
	}, [data, form.values.date, bookingId])

	//select and render xlsx file in react
	const uploadExcelFile = useCallback(
		async (e) => {
			e.preventDefault()
			var files = e.target.files
			if (files.length > 0) {
				let f = files[0]
				retriveDataFromExcel(f, setData)
			} else {
				setSnackbar(
					{
						msg: 'Please select the file which needs to be uploaded',
						sev: 'error',
					},
					setSncBarProps
				)
			}
		},
		[setData]
	)

	return (
		<>
			<DashboardLayout>
				<Paper className={classes.headingContainer} variant="outlined">
					<p>
						<strong>Project ID</strong>:{bookingId}
					</p>
					<TextField
						id="date"
						label="Start date"
						type="date"
						variant="standard"
						sx={{
							width: 300,
						}}
						value={format(form.values.date, 'yyyy-MM-dd')}
						onChange={(e) => {
							form.setFieldValue('date', new Date(e.target.value))
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<Stack direction="row">
						<Button
							sx={{
								m: 1,
								width: 300,
							}}
							disabled={!!isError('date', form)}
							onClick={downloadAttendance}
							startIcon={<GetApp />}
							variant="contained">
							Download Old Attendance
						</Button>
						<FileInput
							sx={{
								m: 1,
								width: 300,
							}}
							disabled={!!isError('date', form)}
							id="uploadFile"
							label="Upload New Attendance"
							variant={'contained'}
							icon={<Publish />}
							onChange={uploadExcelFile}
							type="file"
							accept=".xls,.xlsx"
						/>
						<Button
							sx={{
								m: 1,
								width: 300,
							}}
							disabled={!!isError('date', form) && data.length <= 2}
							onClick={submitAttendance}
							startIcon={<Backup />}
							variant="contained">
							Submit Attendance
						</Button>
					</Stack>
				</Paper>

				{data.length >= 1 && (
					<TableContainer style={{ margin: '16px 0' }} component={Paper} variant="outlined">
						<Table>
							<TableHead>
								<TableRow
									sx={{
										'>*': {
											fontWeight: '900 !important',
										},
									}}>
									<TableCell>Name</TableCell>
									<TableCell>Phone Number</TableCell>
									<TableCell>Worker Type</TableCell>
									<TableCell>Check In Time</TableCell>
									<TableCell>Check out Time</TableCell>
									<TableCell>Fixed Wage</TableCell>
									<TableCell>Over Time</TableCell>
									<TableCell>ESI</TableCell>
									<TableCell>PF</TableCell>
									<TableCell>Net Pay</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((item, index) => {
									if (index !== 0) {
										return (
											<TableRow key={index}>
												{item.map((row, index) => {
													if (index !== 0) {
														return <TableCell key={index}>{row}</TableCell>
													}
												})}
											</TableRow>
										)
									} else {
										return null
									}
								})}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</DashboardLayout>
			<PopAlert {...sncBarProps} />
		</>
	)
}

export default Attendance
