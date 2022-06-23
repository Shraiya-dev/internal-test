import { TextField } from '@material-ui/core'
import { Search } from '@mui/icons-material'
import { Button, Chip, Dialog, InputAdornment, InputLabel, Paper, Select, Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import { RoleOptions } from '../../constant/customers'
import { useFormikProps } from '../../hooks/useFormikProps'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useAddOrgMember } from './hooks/useAddOrgMember'

export const AddOrgMember = ({ open, onClose, organisation }) => {
    const { form, searchForm, result, resultNotFound } = useAddOrgMember(organisation, onClose)
    const formikProps = useFormikProps(form)
    const handelClose = useCallback(() => {
        onClose()
        form.handleReset()
        searchForm.handleReset()
    }, [onClose])
    return (
        <Dialog open={open} onClose={handelClose} fullWidth maxWidth="sm">
            <Stack p={4} spacing={2}>
                <form onSubmit={searchForm.handleSubmit}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            name="customerPhone"
                            value={searchForm.values.customerPhone}
                            onChange={(e) => {
                                const val = e.target.value.trim()
                                if (val.length <= 10 && !isNaN(Number(val))) {
                                    searchForm.setFieldValue('customerPhone', val)
                                }
                            }}
                            placeholder="Enter Phone Number"
                        />
                        <Button type="submit" variant="contained" startIcon={<Search />}>
                            Search
                        </Button>
                    </Stack>
                </form>

                {result && (
                    <Paper variant="outlined">
                        <Stack direction="row" p={2} flexWrap={'wrap'}>
                            <Typography variant="h6" mr={2}>
                                <strong>Name:</strong>&nbsp;
                                {result?.customer?.name}
                            </Typography>
                            <Typography variant="h6" mr={2}>
                                <strong>Phone:</strong>&nbsp;
                                {result?.customer?.phoneNumber}
                            </Typography>
                            <Typography variant="h6">
                                <strong>Email:</strong>&nbsp;
                                {result?.customer?.email}
                            </Typography>
                        </Stack>
                        {result?.organisation && (
                            <Stack direction="row" p={2} flexWrap={'wrap'}>
                                <Typography variant="h6" mr={2}>
                                    <strong>ORG Id:</strong>&nbsp;
                                    {result?.organisation?.organisationId}
                                </Typography>
                                <Typography variant="h6" mr={2}>
                                    <strong>Company Name:</strong>&nbsp;
                                    {result?.organisation?.companyName}
                                </Typography>
                                <Typography variant="h6">
                                    <strong>Role</strong>&nbsp;
                                    {result?.customer?.linkedOrganisation?.role}
                                </Typography>
                                <Typography variant="h6" mr={2}>
                                    <strong>Status:</strong>&nbsp;
                                    {!result?.customer?.linkedOrganisation?.isDeleted ? (
                                        <Chip color="success" label="Active" />
                                    ) : (
                                        <Chip color="error" label="Deactivated" />
                                    )}
                                </Typography>
                            </Stack>
                        )}
                    </Paper>
                )}
                {resultNotFound && (
                    <>
                        <Stack>
                            <Typography color={'grey.A700'} variant={'h5'} textAlign="center">
                                Not such contractor found
                            </Typography>
                        </Stack>
                    </>
                )}
                {result && (
                    <form onSubmit={form.handleSubmit}>
                        <Stack spacing={2}>
                            <Stack spacing={1}>
                                <Stack>
                                    <InputLabel>Role</InputLabel>
                                    <Select fullWidth {...formikProps('role')} helperText={undefined}>
                                        {getSelectOptions([{ label: 'Select Role', value: 'none' }, ...RoleOptions])}
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
                                <Button fullWidth variant="contained" onClick={handelClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" fullWidth variant="outlined">
                                    Add
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                )}
            </Stack>
        </Dialog>
    )
}
