import { Typography } from '@material-ui/core'
import { Button, Dialog, DialogActions, DialogContent, Paper, Select } from '@mui/material'
import { useFormik } from 'formik'
import React, { useCallback, useEffect } from 'react'
import { getSelectOptions } from '../utils/InputHelpers'
import { checkError } from '../utils/formikValidate'
const hiringStatusOption = [
    { label: 'Select Hiring Status', value: 'none' },
    { label: 'To Review', value: 'TO_REVIEW' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Hired', value: 'HIRED' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
]
const UpdateHiringStatusDialog = ({ status, open, confirm, cancel }) => {
    const handelClose = useCallback(() => {
        cancel()
        form.resetForm()
    }, [cancel])

    const onSubmit = useCallback(
        async (values, fh) => {
            confirm(values.status)
            handelClose()
        },
        [handelClose]
    )
    const form = useFormik({
        initialValues: {
            status: 'none',
        },
        validate: (values) => {
            const errors = {}
            if (values.status === 'none') {
                errors.status = true
            }
            return errors
        },
        onSubmit: onSubmit,
    })
    useEffect(() => {
        form.setFieldValue('status', status)
    }, [status])

    const isError = useCallback(
        (field) => {
            return checkError(field, form)
        },
        [form]
    )
    return (
        <Dialog open={open}>
            <Paper
                component={'form'}
                onSubmit={form.handleSubmit}
                sx={{
                    width: 500,
                }}
            >
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5">Update Hiring Status</Typography>
                    <Select
                        fullWidth
                        value={form.values.status}
                        name="status"
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        error={!!isError('status')}
                    >
                        {getSelectOptions(hiringStatusOption)}
                    </Select>
                </DialogContent>
                <DialogActions
                    sx={{
                        p: 4,
                    }}
                >
                    <Button size="large" variant="outlined" onClick={cancel}>
                        Cancel
                    </Button>
                    <Button
                        type={'submit'}
                        disabled={form.values.status === 'none'}
                        size="large"
                        variant="contained"
                        onClick={() => confirm(form.values.status)}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Paper>
        </Dialog>
    )
}

export default UpdateHiringStatusDialog
