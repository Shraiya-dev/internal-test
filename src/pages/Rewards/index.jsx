import DateFnsUtils from '@date-io/date-fns'
import {
	Button,
	makeStyles,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@material-ui/core'
import { Backup } from '@material-ui/icons'
import Publish from '@material-ui/icons/Publish'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import axios from 'axios'
import { format, isAfter } from 'date-fns'
import { useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { getBackendUrl } from '../../api'
import { FileInput } from '../../components/CustomInputs'
import { PopAlert, setSnackbar } from '../../components/Snackbar'
import { createCsvBlob, retriveDataFromExcel } from '../../utils/fileUtils'
import { isError } from '../../utils/formErrorsChecker'

const useStyles = makeStyles((theme) => ({
	headingContainer: {
		backgroundColor: '#ffffff',
		padding: '30px 0',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-end',
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

const selectOption = [
	{
		label: 'Select Type',
		value: 0,
	},
	{
		label: 'Reward',
		value: 1,
	},
	{
		label: 'Penalties',
		value: 2,
	},
]

const RewardAndPenalty = () => {
	const [data, setData] = React.useState([])
	const [sncBarProps, setSncBarProps] = React.useState({
		msg: '',
	})
	const classes = useStyles()
	const form = useFormik({
		initialValues: {
			date: new Date(),
			type: 0,
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

	const submitRewards = useCallback(async () => {
		const t = data.map((item, index) => {
			if (index !== 0) {
				return item.map((row, idx) => {
					if (idx === 1) {
						return format(new Date(Math.round((row - (25567 + 2)) * 86400 * 1000)), 'yyyy-MM-dd')
					} else {
						return row
					}
				})
			} else {
				return item
			}
		})
		const file = createCsvBlob(t)
		const formData = new FormData()
		formData.append('file', file, form.values.date.toLocaleDateString())
		formData.append('date', format(form.values.date, 'yyyy-MM-dd'))
		try {
			const res = await axios.post(
				`${getBackendUrl()}/admin/${form.values.type === 1 ? 'rewards' : 'penalties'}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			setSnackbar(
				{
					msg: 'File Uploaded Successfully',
					sev: 'success',
				},
				setSncBarProps
			)
			setData([])
		} catch (error) {
			setSnackbar(
				{
					msg: 'Failed to upload file ',
					sev: 'error',
				},
				setSncBarProps
			)
		}
	}, [data, setSnackbar, setSncBarProps])

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
			<div>
				<div className={classes.headingContainer}>
					<Select
						style={{
							marginRight: '30px',
						}}
						value={form.values.type}
						onChange={(e) => {
							form.setFieldValue('type', Number(e.target.value))
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
						id="date"
						label="Start date"
						type="date"
						variant="standard"
						value={format(form.values.date, 'yyyy-MM-dd')}
						onChange={(e) => {
							form.setFieldValue('date', new Date(e.target.value))
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>

				{form.values.type !== 0 && (
					<div className={classes.btnContainer}>
						<FileInput
							disabled={!!isError('date', form)}
							className={classes.m10}
							id="uploadFile"
							label={`Upload ${form.values.type === 1 ? 'Reward' : 'Penalties'}`}
							variant={'contained'}
							onChange={uploadExcelFile}
							icon={<Publish />}
							type="file"
							accept=".xls,.xlsx"
						/>
						<Button
							disabled={!!isError('date', form) && data.length <= 2}
							startIcon={<Backup />}
							onClick={submitRewards}
							className={classes.m10}
							variant="contained">
							Submit {form.values.type === 1 ? 'Reward' : 'Penalties'}
						</Button>
					</div>
				)}

				{data.length >= 1 && (
					<TableContainer style={{ maxWidth: '80%', margin: '0 auto' }} component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Reward Type</TableCell>
									<TableCell>Amount</TableCell>
									<TableCell>Description</TableCell>
									<TableCell>Source</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((item, index) => {
									if (index !== 0) {
										return (
											<TableRow key={index}>
												{item.map((row, index) => {
													if (index !== 0 && index !== 1) {
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
			</div>
			<PopAlert {...sncBarProps} />
		</>
	)
}

export default RewardAndPenalty
