import { Button, Dialog, InputLabel, Select, Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import { DesignationOptions, RoleOptions } from '../../constant/customers'
import { useFormikProps } from '../../hooks/useFormikProps'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useEditOrgCustomer } from './hooks/useEditOrgCustomer'

export const EditOrgCustomer = ({ open, onClose, data }) => {
    const { form, activateMember, deactivateMember, roles } = useEditOrgCustomer(data, onClose)
    const formikProps = useFormikProps(form)
    const handelClose = useCallback(() => {
        onClose()
        form.handleReset()
        searchForm.handleReset()
    }, [onClose])
    return (
        <Dialog open={open} onClose={handelClose} fullWidth maxWidth="sm">
            <Stack p={4} spacing={2}>
                {
                    <form onSubmit={form.handleSubmit}>
                        <Stack spacing={2}>
                            <Typography variant="h6">
                                <strong>User Name:&nbsp;</strong>
                                {data?.name}
                            </Typography>
                            <Stack spacing={1}>
                                <Stack>
                                    <InputLabel>Role</InputLabel>
                                    <Select fullWidth {...formikProps('role')} helperText={undefined}>
                                        {getSelectOptions([{ label: 'Select Role', value: 'none' }, ...roles])}
                                    </Select>
                                </Stack>
                                {/* <Stack>
                                    <InputLabel>Designation</InputLabel>
                                    <Select fullWidth {...formikProps('designation')} helperText={undefined}>
                                        {getSelectOptions([
                                            { label: 'Select Designation', value: 'none' },
                                            ...DesignationOptions,
                                        ])}
                                    </Select>
                                </Stack> */}
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                {data?.linkedOrganisation?.isDeleted ? (
                                    <Button fullWidth variant="contained" color={'success'} onClick={activateMember}>
                                        Activate
                                    </Button>
                                ) : (
                                    <Button fullWidth variant="contained" color={'error'} onClick={deactivateMember}>
                                        Deactivate
                                    </Button>
                                )}
                                <Button type="submit" fullWidth variant="contained">
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                }
            </Stack>
        </Dialog>
    )
}
