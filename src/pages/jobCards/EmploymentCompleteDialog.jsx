import { Button, Dialog, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useCallback } from 'react'
import { checkError } from '../../utils/formikValidate'
import { getSelectOptions } from '../../utils/InputHelpers'
const reasonOption = [
    { label: 'Select Reason *', value: 'none' },
    { label: 'Tenure Complete', value: 'TENURE_COMPLETE' },
    { label: 'Worker Churned', value: 'WORKER_CHURNED' },
    { label: 'Employer Termination', value: 'EMPLOYER_TERMINATION' },
    { label: 'Customer Termination', value: 'CUSTOMER_TERMINATION' },
    { label: 'Other', value: 'OTHERS' },
]
const EmploymentCompleteDialog = ({ open = false, workerCard, setOpen, confirm }) => {
    const handelClose = useCallback(() => {
        setOpen()
        form.resetForm()
    }, [setOpen])
    const onSubmit = useCallback(
        async (values) => {
            confirm(workerCard, values)

            handelClose()
        },
        [workerCard, handelClose]
    )
    const form = useFormik({
        initialValues: {
            reason: 'none',
            otherReason: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.reason === 'none') {
                errors.reason = 'Reason is required field!'
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
                        <Typography variant="h5">Complete Employment</Typography>
                        <Select
                            value={form.values.reason}
                            name="reason"
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={!!isError('reason')}
                        >
                            {getSelectOptions(reasonOption)}
                        </Select>
                        {form.values.reason === 'OTHERS' && (
                            <TextField
                                name="other"
                                value={form.values.other}
                                error={!!isError('other')}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                multiline
                                minRows={4}
                                placeholder="Description"
                            />
                        )}
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

export default EmploymentCompleteDialog
