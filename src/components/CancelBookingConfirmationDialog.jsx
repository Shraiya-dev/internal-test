import { Button, Dialog, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useState, useEffect } from 'react'
import { useSnackbar } from '../providers/SnackbarProvider'
import { checkError } from '../utils/formikValidate'
import { getSelectOptions } from '../utils/InputHelpers'
import { getBackendUrl } from '../api'
const SERVER_URL = getBackendUrl()
const CancelBookingConfirmationDialog = ({ open = false, cancel, confirm }) => {
    const handelClose = useCallback(() => {
        cancel()
        form.resetForm()
    }, [cancel])
    const { showSnackbar } = useSnackbar()
    const [cancellationReason, setCancellationReason] = useState([
        { label: 'Select Cancellation Reason', value: 'none' },
    ])

    const onSubmit = useCallback(
        async (values, fh) => {
            confirm(values)
            handelClose()
        },
        [handelClose]
    )
    const form = useFormik({
        initialValues: {
            cancellationReason: 'none',
            details: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.cancellationReason === 'none') {
                errors.cancellationReason = 'Cancellation reason is required '
            }

            if (values.cancellationReason === 'OTHERS' && values.details === '') {
                errors.details = 'Reason required'
            }

            return errors
        },
        onSubmit: onSubmit,
    })

    const isError = useCallback(
        (field) => {
            return checkError(field, form)
        },
        [form]
    )
    useEffect(async () => {
        try {
            const { status, data } = await axios.get(`${SERVER_URL}/gateway/metadata/bookings/cancellation-reasons`)

            setCancellationReason([
                { label: 'Select Cancellation code', value: 'none' },
                ...data?.payload.cancellationReasons,
            ])
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [])

    return (
        <Dialog open={open} onClose={handelClose}>
            <Paper
                sx={{
                    p: 4,
                    width: 500,
                }}
            >
                <form onSubmit={form.handleSubmit}>
                    <Stack spacing={2}>
                        <Typography variant="h5">Cancel Booking</Typography>
                        <Select
                            value={form.values.cancellationReason}
                            name="cancellationReason"
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={!!isError('cancellationReason')}
                        >
                            {getSelectOptions(cancellationReason)}
                        </Select>
                        <TextField
                            name="details"
                            value={form.values.details}
                            error={!!isError('details')}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            helperText={isError('details')}
                            multiline
                            minRows={4}
                            placeholder="details"
                        />
                    </Stack>
                    <Stack pt={2} direction="row" justifyContent="flex-end" spacing={2}>
                        <Button onClick={handelClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Confirm
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Dialog>
    )
}

export default CancelBookingConfirmationDialog
