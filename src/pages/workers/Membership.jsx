import { Button, InputLabel, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React from 'react'
import * as Yup from 'yup'
import { getBackendUrl } from '../../api'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { useFormik } from 'formik'
import { useFormikProps } from '../../hooks/useFormikProps'
const SERVER_URL = getBackendUrl()
export const Membership = ({ uid, user, fetchWorker }) => {
    const { showSnackbar } = useSnackbar()
    const form = useFormik({
        initialValues: {
            amount: '',
        },
        validationSchema: Yup.object({
            amount: Yup.number().required('required').min(1),
        }),
        onSubmit: async (values) => {
            try {
                const { data } = await axios.post(`${SERVER_URL}/gateway/admin-api/workers/add-members`, {
                    workerIds: [user.id],
                    membershipType: 'GOLD',
                    amountOfMembership: values.amount,
                })
                if (data?.payload.successCount !== 0) {
                    showSnackbar({
                        msg: `Worker Upgraded to GOLD Membership`,
                        sev: 'success',
                    })
                    fetchWorker()
                } else {
                    showSnackbar({
                        msg: data?.payload.failedWorkers[0].message,
                        sev: 'error',
                    })
                }
            } catch (error) {
                showSnackbar({
                    msg: `Failed to upgraded worker membership to GOLD`,
                    sev: 'error',
                })
            }
        },
    })
    const formikProps = useFormikProps(form)

    return (
        <>
            <Stack p={2}>
                <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                    <h3>Membership Details</h3>
                    {user?.workerMembership?.type !== 'GOLD' && (
                        <>
                            <TextField label="Add Enter amount" placeholder="amount" {...formikProps('amount')} />
                            <Button variant="contained" onClick={() => form.handleSubmit()}>
                                Mark As Gold
                            </Button>
                        </>
                    )}
                </Stack>

                {user?.workerMembership?.type ? (
                    <Stack direction="row" spacing={2}>
                        <Stack>
                            <InputLabel>type</InputLabel>
                            <Typography>{user?.workerMembership?.type ?? 'None'}</Typography>
                        </Stack>
                        <Stack>
                            <InputLabel>Updated on </InputLabel>
                            <Typography>{user?.workerMembership?.addedOn?.split('T')[0] ?? ''}</Typography>
                        </Stack>
                    </Stack>
                ) : null}
            </Stack>
        </>
    )
}
