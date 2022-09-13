import { Button, Dialog, FormHelperText, Select, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { CityOptions } from '../../constant/city'
import { StatesOptions } from '../../constant/state'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useVerification } from './hooks/useVerification'

export const Verification = ({ uid, user, fetchWorker }) => {
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({
        open: false,
    })
    const [certificationDialogProps, setCertificationDialogProps] = useState({
        open: false,
    })
    const { updateVerification, form, formikProps } = useVerification(
        uid,
        user,
        fetchWorker,
        setCertificationDialogProps
    )
    return (
        <>
            <Stack p={2}>
                <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                    <h3>Verification Status</h3>
                    {user?.verification?.verificationStatus === 'UNVERIFIED' && (
                        <Button variant="contained" onClick={() => setConfirmationDialogProps({ open: true })}>
                            Verify User
                        </Button>
                    )}
                    {user?.verification?.verificationStatus === 'VERIFIED' && (
                        <Button
                            variant="contained"
                            onClick={() =>
                                setCertificationDialogProps({
                                    open: true,
                                })
                            }
                        >
                            Certify User
                        </Button>
                    )}
                </Stack>
                <Typography>{user?.verification?.verificationStatus}</Typography>
            </Stack>
            <ConfirmationDialog
                cancel={() => setConfirmationDialogProps({ open: false })}
                confirm={async () => {
                    await updateVerification('VERIFICATION')
                    setConfirmationDialogProps({ open: false })
                    fetchWorker()
                }}
                content={<Typography variant="h5">Mark {user?.name} as verified?</Typography>}
                {...confirmationDialogProps}
            />
            <Dialog maxWidth="xs" fullWidth {...certificationDialogProps}>
                <Stack component="form" onSubmit={form.handleSubmit} p={2} spacing={2}>
                    <Typography textAlign="center" variant="h5">
                        Certification Details
                    </Typography>
                    <TextField label="Site Name" {...formikProps('siteName')} />
                    <Box>
                        <Select
                            fullWidth
                            variant="outlined"
                            {...formikProps('state')}
                            onChange={(e) => {
                                form.handleChange(e)
                                form.setFieldValue('city', 'none')
                            }}
                        >
                            {getSelectOptions([{ label: 'Select state', value: 'none' }, ...StatesOptions])}
                        </Select>
                        <FormHelperText error={formikProps('state')?.error}>
                            {formikProps('state')?.helperText}
                        </FormHelperText>
                    </Box>

                    <Box>
                        <Select
                            fullWidth
                            variant="outlined"
                            disabled={form.values.state === 'none'}
                            {...formikProps('city')}
                        >
                            {getSelectOptions([
                                { label: 'Select city', value: 'none' },
                                ...(CityOptions[form.values.state] ?? []),
                            ])}
                        </Select>
                        <FormHelperText error={formikProps('city')?.error}>
                            {formikProps('city')?.helperText}
                        </FormHelperText>
                    </Box>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setCertificationDialogProps({
                                    open: false,
                                })
                                form.resetForm()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Confirm
                        </Button>
                    </Stack>
                </Stack>
            </Dialog>
        </>
    )
}
