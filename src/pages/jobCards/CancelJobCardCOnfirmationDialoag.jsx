import { Button, Dialog, Select, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { getBackendUrl } from '../../api'
import { checkError } from '../../utils/formikValidate'

const SERVER_URL = getBackendUrl()
export const CancelJobCardConfirmationDialog = ({ open, cancel, confirm, jobCardState, bookingState }) => {
    const { showSnackbar } = useSnackbar()
    const [churnTypes, setChurnTypes] = useState([])
    const [churnReasons, setChurnReasons] = useState([])
    const onSubmit = useCallback(
        (values, fh) => {
            confirm(values.churnType, values.churnReason, values.other)
            fh.resetForm()
        },
        [confirm]
    )
    const form = useFormik({
        initialValues: {
            churnType: 'none',
            churnReason: 'none',
            other: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.churnType === 'none') {
                errors.churnType = 'Churn Type is required'
            }
            if (values.churnReason === 'none') {
                errors.churnReason = 'Churn Reason is Required'
            }
            if (values.churnReason === 'OTHERS' && values.other === '') {
                errors.other = 'Required *'
            }
            return errors
        },
        onSubmit: onSubmit,
    })

    const handelDialogClose = useCallback(() => {
        cancel()
        form.handleReset()
        setChurnTypes([{ label: 'Select churn type', value: 'none' }])
        setChurnReasons([{ label: 'Select churn reason', value: 'none' }])
    }, [cancel])

    useEffect(async () => {
        if (!(bookingState || jobCardState)) {
            setChurnTypes([{ label: 'Select churn type', value: 'none' }])
            setChurnReasons([{ label: 'Select churn reason', value: 'none' }])
        } else {
            try {
                const urlParams = new URLSearchParams()
                urlParams.set('bookingState', bookingState)
                urlParams.set('jobCardState', jobCardState)
                const { status, data } = await axios.get(
                    `${SERVER_URL}/gateway/metadata/job-card/churn-types?${urlParams}`
                )

                setChurnTypes([
                    { label: 'Select churn type', value: 'none' },
                    ...data?.payload?.churnTypes?.map((item) => ({ label: item.churnType, value: item.churnType })),
                ])
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        }
    }, [jobCardState, bookingState])
    useEffect(async () => {
        if (form.values.churnType === 'none') {
            setChurnReasons([{ label: 'Select churn reason', value: 'none' }])
        } else {
            try {
                const urlParams = new URLSearchParams()
                urlParams.set('churnType', form.values.churnType)

                const { status, data } = await axios.get(
                    `${SERVER_URL}/gateway/metadata/job-card/cancellation-reasons?${urlParams.toString()}`
                )
                setChurnReasons([
                    { label: 'Select churn reason', value: 'none' },
                    ...data.payload.cancellationReasons.map((item) => ({
                        label: item.cancellationReason,
                        value: item.cancellationReason,
                    })),
                ])
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        }
    }, [form.values.churnType])
    return (
        <Dialog open={open} onClose={handelDialogClose}>
            <form onSubmit={form.handleSubmit}>
                <Stack p={2} width={500} spacing={2}>
                    <Typography>Select Cancellation Reason</Typography>
                    <Stack spacing={2}>
                        <Select
                            name="churnType"
                            value={form.values.churnType}
                            error={checkError('churnType', form)}
                            onBlur={form.handleBlur}
                            onChange={(e) => {
                                form.setFieldValue('churnReason', 'none')
                                form.handleChange(e)
                            }}
                        >
                            {getSelectOptions(churnTypes)}
                        </Select>
                        {form.values.churnType !== 'none' && (
                            <Select
                                name="churnReason"
                                error={checkError('churnReason', form)}
                                value={form.values.churnReason}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                            >
                                {getSelectOptions(churnReasons)}
                            </Select>
                        )}
                        <TextField
                            multiline
                            minRows={2}
                            name="other"
                            error={!!checkError('other', form)}
                            helperText={checkError('other', form)}
                            onChange={form.handleChange}
                            placeholder="Enter Reason *"
                            onBlur={form.handleBlur}
                            value={form.values.other}
                        />
                    </Stack>
                    <Stack pt={2} direction="row" justifyContent="flex-end" spacing={2}>
                        <Button onClick={handelDialogClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Confirm
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Dialog>
    )
}
