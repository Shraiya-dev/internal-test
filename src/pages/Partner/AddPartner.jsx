import { Box, Button, Paper, TextField, Typography } from '@material-ui/core'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { getBackendUrl } from '../../api'
import { PopAlert, setSnackbar } from '../../components/Snackbar'
import { checkError } from '../../utils/formikValidate'

const AddPartner = () => {
	const [sncBarProps, setSncBarProps] = useState({
		msg: '',
	})
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

			if (values.phoneNumber === '' || Number.isNaN(Number(values.phoneNumber))) {
				errors.phoneNumber = 'Enter Valid phone Number'
			}
			return errors
		},
		onSubmit: async (values, formHelpers) => {
			try {
				const res = await axios.post(`${getBackendUrl()}/admin/partner`, {
					userName: values.userName,
					phoneNumber: '+91' + values.phoneNumber,
				})
				if (res.data.success) {
					setSnackbar(
						{
							msg: 'Partner Added Successfully',
							sev: 'success',
						},
						setSncBarProps
					)
					formHelpers.resetForm()
				} else {
					setSnackbar(
						{
							msg: res.data.error,
							sev: 'error',
						},
						setSncBarProps
					)
				}
			} catch (error) {
				console.log(error)
			}
		},
	})
	return (
		<>
			<Paper style={{ margin: '20px auto', width: '700px' }}>
				<Box padding={2} display="flex" flexDirection="column" alignItems="center">
					<Typography color="primary" variant="h4">
						Add Partner
					</Typography>

					<form onSubmit={form.handleSubmit}>
						<Box margin={4} display="flex" flexDirection="column" alignItems="center">
							<TextField
								error={!!checkError('userName', form)}
								name="userName"
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
								value={form.values.phoneNumber}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
								style={{ marginBottom: '20px' }}
								variant="outlined"
								label="Phone Number"
							/>
							<Button type="submit" variant="contained" fullWidth>
								Add Partner
							</Button>
						</Box>
					</form>
				</Box>
			</Paper>
			<PopAlert {...sncBarProps} />
		</>
	)
}

export default AddPartner
