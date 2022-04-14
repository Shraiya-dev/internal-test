import { Box, Button, Paper, TextField, Typography, Chip, Stack } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { getBackendUrl } from '../../api'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert, setSnackbar } from '../../components/Snackbar'
import { checkError } from '../../utils/formikValidate'
import { useSnackbar } from '../../providers/SnackbarProvider'

const AddPartner = () => {
    const { showSnackbar } = useSnackbar()
    const [referralCode, setReferralCode] = useState('')
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
                const { data } = await axios.post(`${getBackendUrl()}/admin/partner`, {
                    userName: values.userName,
                    phoneNumber: '+91' + values.phoneNumber,
                })
                debugger
                showSnackbar({
                    msg: 'Partner Added Successfully',
                    sev: 'success',
                })
                setReferralCode(data?.payload?.response?.referralCode)
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
                        {referralCode !== '' && (
                            <Stack alignItems="center">
                                <Chip color="primary" label={`Referral Code:  ${referralCode}`} />
                            </Stack>
                        )}
                    </Box>
                </Paper>
            </DashboardLayout>
        </>
    )
}

export default AddPartner
