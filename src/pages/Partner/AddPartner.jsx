import {
	Box,
	Button,
	Chip,
	Grid,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
	Paper,
	TextField,
	Typography,
} from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { getBackendUrl } from '../../api'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert, setSnackbar } from '../../components/Snackbar'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { checkError } from '../../utils/formikValidate'

const AddPartner = () => {
	const [data, setData] = useState([])
	const [flag, setFlag] = useState(false)
	const { showSnackbar } = useSnackbar()
	const form = useFormik({
		initialValues: {
			userName: '',
			phoneNumber: '',
		},
		validate: (values) => {
			const errors = {}
			if (values.userName === '') {
				errors.userName = 'Enter Valid Name'
			}

			if (
				values.phoneNumber === '' ||
				Number.isNaN(Number(values.phoneNumber)) ||
				`${values.phoneNumber}`.length !== 10
			) {
				errors.phoneNumber = 'Enter Valid phone Number'
			}
			return errors
		},
		onSubmit: async (values, formHelpers) => {
			setFlag(false)
			try {
				const res = await axios.post(`${getBackendUrl()}/admin/partner`, {
					userName: values.userName,
					phoneNumber: '+91' + values.phoneNumber,
				})

				setData([...data, res.data.payload.response])
				setFlag(true)

				showSnackbar({
					msg: 'Partner Added Successfully',
					sev: 'success',
				})
				formHelpers.resetForm()
			} catch (error) {
				showSnackbar({
					msg: error.response.data.developerInfo,
					sev: 'error',
				})
			}
		},
	})
	return (
		<>
			<DashboardLayout>
				<Paper style={{ margin: '20px auto', width: '700px' }} variant="outlined">
					<Box padding={2} display="flex" flexDirection="column" alignItems="center">
						<Typography color="primary" variant="h4">
							Add Partner
						</Typography>

						<form onSubmit={form.handleSubmit}>
							<Box margin={4} display="flex" flexDirection="column" alignItems="center">
								<TextField
									error={!!checkError('userName', form)}
									name="userName"
									fullWidth
									value={form.values.userName}
									onChange={form.handleChange}
									onBlur={form.handleBlur}
									style={{ marginBottom: '20px' }}
									variant="outlined"
									label="Name"
								/>
								<TextField
									error={!!checkError('phoneNumber', form)}
									name="phoneNumber"
									fullWidth
									value={form.values.phoneNumber}
									onChange={(e) => {
										if (e.target.value.length <= 10) {
											form.handleChange(e)
										}
									}}
									onBlur={form.handleBlur}
									style={{ marginBottom: '20px' }}
									variant="outlined"
									label="Phone Number"
									InputProps={{
										startAdornment: <InputAdornment position="start">+91</InputAdornment>,
									}}
								/>
								<Button type="submit" variant="contained" fullWidth>
									Add Partner
								</Button>
							</Box>
						</form>
					</Box>
				</Paper>
				{flag ? (
					<Paper style={{ margin: '20px auto', width: '700px' }} variant="outlined">
						<Typography variant="h6" p={4} fontSize={20}>
							Ref Code: &nbsp;
							<Chip size="medium" label={`${data[0]?.referralCode}`} sx={{ fontSize: '20px' }} color="primary" />
						</Typography>
						<Grid container spacing={4} px={4} pb={4}>
							<Grid item xs={6} fontSize={20}>
								Name : {data[0]?.userName}
							</Grid>
							<Grid item xs={6} fontSize={20}>
								Phone Number : {data[0]?.phoneNumber}
							</Grid>
						</Grid>
					</Paper>
				) : (
					''
				)}
			</DashboardLayout>
		</>
	)
}

export default AddPartner
