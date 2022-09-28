import { Button, Grid, InputLabel, LinearProgress, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import DashboardLayout from '../../../components/Layouts/DashboardLayout'
import { getSelectOptions } from '../../../utils/InputHelpers'
import { useAddEditCustomerDetails } from './hooks/useAddEditCustomerDetails'
import { DesignationOptions } from '../../../constant/customers'
import { Link } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
export const AddEditCustomerDetail = () => {
    const { customer, organisation, formikProps, form, refresh, disableForm, handleFormEditCancel } =
        useAddEditCustomerDetails()
    return (
        <DashboardLayout loading={refresh}>
            <Stack
                component={'form'}
                onSubmit={form.handleSubmit}
                alignItems="stretch"
                margin="0 auto"
                maxWidth={1000}
                spacing={2}
            >
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h4">Customer Details</Typography>
                    <Stack direction="row" spacing={1}>
                        {disableForm ? (
                            <Button variant="outlined" onClick={() => handleFormEditCancel(false)}>
                                Edit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        handleFormEditCancel(true)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <LoadingButton type="submit" loading={form.isSubmitting} variant="contained">
                                    Submit
                                </LoadingButton>
                            </>
                        )}
                    </Stack>
                </Stack>
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputLabel>Phone Number</InputLabel>
                            <Typography>{customer?.phoneNumber ?? 'NA'}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel>Status</InputLabel>
                            <Typography>{customer?.customerStatus ?? 'NA'}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField fullWidth label="Name" {...formikProps('name')} disabled={disableForm} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField fullWidth label="Email" {...formikProps('email')} disabled={disableForm} />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                {...formikProps('companyName')}
                                disabled={disableForm}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField fullWidth label="GSTIN" {...formikProps('gstin')} disabled={disableForm} />
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                fullWidth
                                {...formikProps('designation')}
                                helperText={undefined}
                                disabled={disableForm}
                            >
                                {getSelectOptions([
                                    { label: 'Select Designation', value: 'none' },
                                    ...DesignationOptions,
                                ])}
                            </Select>
                        </Grid>
                    </Grid>
                </Paper>
                {organisation && (
                    <>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h4">Organisation Details</Typography>
                            <Stack direction="row" spacing={1}>
                                <Link to={`/organization?organisationId=${organisation?.organisationId}`}>
                                    <Button variant="outlined" color="primary">
                                        View Organisation
                                    </Button>
                                </Link>
                            </Stack>
                        </Stack>

                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <InputLabel>Company Name</InputLabel>
                                    <Typography>{organisation?.companyName ?? 'NA'}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <InputLabel>GSTIN</InputLabel>
                                    <Typography>{organisation?.GSTIN ?? 'NA'}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </>
                )}
            </Stack>
        </DashboardLayout>
    )
}
