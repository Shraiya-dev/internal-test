import { Box, Button, DialogContent, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { checkError } from '../../../utils/formikValidate'

const AddPartners = ({ open, setOpen }) => {
    const { showSnackbar } = useSnackbar()
    const [sp, setSp] = useSearchParams()
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
            try {
                const res = await axios.post(`${getBackendUrl()}/admin/partner`, {
                    userName: values.userName,
                    phoneNumber: '+91' + values.phoneNumber,
                })

                showSnackbar({
                    msg: 'Partner Added Successfully',
                    sev: 'success',
                })
                setSp(
                    {
                        phoneNumber: values.phoneNumber,
                    },
                    {
                        replace: true,
                    }
                )
                handleClose()
                formHelpers.resetForm()
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        },
    })

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <DialogContent>
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
                                if (e.target.value.length <= 10 && !Number.isNaN(Number(e.target.value)) ) {
                                    form.handleChange(e)
                                }
                            }}
                            helperText={checkError('phoneNumber', form)}
                            onBlur={form.handleBlur}
                            style={{ marginBottom: '20px' }}
                            variant="outlined"
                            label="Phone Number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                        />
                        <Stack direction="row" spacing={8}>
                            <Button variant="contained" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Add Partner
                            </Button>
                        </Stack>
                    </Box>
                </form>
            </Box>
        </DialogContent>
    )
}

export default AddPartners
