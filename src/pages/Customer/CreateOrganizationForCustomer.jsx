import {
    Alert,
    Button,
    Chip,
    Dialog,
    InputAdornment,
    InputLabel,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useSearchCustomer } from './hooks/useSearchCustomer'
import { Search } from '@mui/icons-material'
import { useCreateOrganizationForCustomer } from './hooks/useCreateOrganizationForCustomer'
import { useEffect } from 'react'
import { LoadingButton } from '@mui/lab'

export const CreateOrganizationForCustomer = ({ open, onClose }) => {
    const { form: searchForm, result, resultNotFound } = useSearchCustomer()
    const { form } = useCreateOrganizationForCustomer(() => {
        searchForm.resetForm()
        onClose()
    })
    const handelClose = () => {
        form.resetForm()
        searchForm.resetForm()
        onClose()
    }
    useEffect(() => {
        form.setFieldValue('customerId', result?.customer?.customerId ?? '')
    }, [result])

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
                {result?.organisation && (
                    <>
                        <Alert severity="error">User already has organisation</Alert>
                    </>
                )}

                {result && (
                    <form onSubmit={form.handleSubmit}>
                        <Stack spacing={2}>
                            <Stack spacing={1}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="orgName"
                                    value={form.values.orgName}
                                    error={form.touched.orgName && form.errors.orgName}
                                    helperText={form.touched.orgName && form.errors.orgName ? form.errors.orgName : ''}
                                    onChange={form.handleChange}
                                    placeholder="Enter Company Name"
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="gstin"
                                    value={form.values.gstin}
                                    error={form.touched.gstin && form.errors.gstin}
                                    helperText={form.touched.gstin && form.errors.gstin ? form.errors.gstin : ''}
                                    onChange={form.handleChange}
                                    placeholder="Enter GSTIN"
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Button fullWidth variant="outlined" onClick={handelClose}>
                                    Cancel
                                </Button>
                                <LoadingButton
                                    disabled={result?.organisation}
                                    loading={form.isSubmitting}
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                >
                                    Create
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </form>
                )}
            </Stack>
        </Dialog>
    )
}
