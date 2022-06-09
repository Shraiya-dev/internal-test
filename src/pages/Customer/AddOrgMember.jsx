import { TextField } from '@material-ui/core'
import { Search } from '@mui/icons-material'
import { Button, Dialog, InputAdornment, InputLabel, Paper, Select, Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DesignationOptions, RoleOptions } from '../../constant/customers'
import { useFormikProps } from '../../hooks/useFormikProps'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useAddOrgMember } from './hooks/useAddOrgMember'
import { useSearchCustomer } from './hooks/useSearchCustomer'

export const AddOrgMember = ({ open, onClose, organisation }) => {
    const { form, searchForm, result } = useAddOrgMember(organisation, onClose)
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
                                const val = e.target.value
                                if (val.length <= 10 && !isNaN(Number(val))) {
                                    searchForm.handleChange(e)
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
                                {result?.name}
                            </Typography>
                            <Typography variant="h6" mr={2}>
                                <strong>Phone:</strong>&nbsp;
                                {result?.phoneNumber}
                            </Typography>
                            <Typography variant="h6">
                                <strong>Email:</strong>&nbsp;
                                {result?.email}
                            </Typography>
                        </Stack>
                    </Paper>
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
                                <Stack>
                                    <InputLabel>Designation</InputLabel>
                                    <Select fullWidth {...formikProps('designation')} helperText={undefined}>
                                        {getSelectOptions([
                                            { label: 'Select Designation', value: 'none' },
                                            ...DesignationOptions,
                                        ])}
                                    </Select>
                                </Stack>
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
