import { Button, Dialog, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useState, useEffect } from 'react'
import { getBackendUrl } from '../../api'
import { useSnackbar } from '../../providers/SnackbarProvider'
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
const SERVER_URL = getBackendUrl()
const EmploymentCompleteDialog = ({ open = false, setOpen, confirm }) => {
    const handelClose = useCallback(() => {
        setOpen()
        form.resetForm()
    }, [setOpen])
    const { showSnackbar } = useSnackbar()
    const [completionReason, setCompletionReason] = useState([{ label: 'Select Completion code', value: 'none' }])
    const [partialCompletionReason, setPartialCompletionReason] = useState([
        { label: 'Select Partial Completion reason', value: 'none' },
    ])

    const onSubmit = useCallback(
        async (values, fh) => {
            await confirm(values)
            handelClose()
        },
        [handelClose]
    )
    const form = useFormik({
        initialValues: {
            completionCode: 'none',
            partialCompletionReason: 'none',
            description: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.completionCode === 'none') {
                errors.completionCode = 'Completion Code is required '
            }
            if (
                !['TENURE_COMPLETE', 'none'].includes(values.completionCode) &&
                values.partialCompletionReason === 'none'
            ) {
                errors.partialCompletionReason = 'partialCompletionReason Code is required '
            }
            if (values.partialCompletionReason === 'OTHERS' && values.description === '') {
                errors.description = 'Reason required'
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
            const { status, data } = await axios.get(`${SERVER_URL}/gateway/metadata/employee/completion-codes`)

            setCompletionReason([
                { label: 'Select Completion code', value: 'none' },
                ...data?.payload?.employmentCompletionCodes
                    ?.filter((item) => item.employmentCompletionCode !== 'TENURE_COMPLETE')
                    ?.map((item) => ({
                        label: item.employmentCompletionCode,
                        value: item.employmentCompletionCode,
                    })),
            ])
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [])
    useEffect(async () => {
        form.setFieldValue('partialCompletionReason', 'none')
        setPartialCompletionReason([{ label: 'Select Completion code', value: 'none' }])
        if (['TENURE_COMPLETE', 'none'].includes(form.values.completionCode)) return
        try {
            const sp = new URLSearchParams()
            sp.set('completionCode', form.values.completionCode)
            const { status, data } = await axios.get(
                `${SERVER_URL}/gateway/metadata/employee/partial-completion-reasons?` + sp
            )

            setPartialCompletionReason([
                { label: 'Select Completion code', value: 'none' },
                ...data?.payload.partialCompletionReasons?.map((item) => ({
                    label: item.partialCompletionReason,
                    value: item.partialCompletionReason,
                })),
            ])
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [form.values.completionCode])

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
                            value={form.values.completionCode}
                            name="completionCode"
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={!!isError('completionCode')}
                        >
                            {getSelectOptions(completionReason)}
                        </Select>
                        {!['TENURE_COMPLETE', 'none'].includes(form.values.completionCode) && (
                            <Select
                                value={form.values.partialCompletionReason}
                                name="partialCompletionReason"
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                error={!!isError('partialCompletionReason')}
                            >
                                {getSelectOptions(partialCompletionReason)}
                            </Select>
                        )}
                        <TextField
                            name="description"
                            value={form.values.description}
                            error={!!isError('description')}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            helperText={isError('description')}
                            multiline
                            minRows={4}
                            placeholder="Description"
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

export default EmploymentCompleteDialog
