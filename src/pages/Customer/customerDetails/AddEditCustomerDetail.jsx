import { useState } from 'react'
import { Button, Grid, InputLabel, Chip, Paper, Select, Stack, TextField, Typography, MenuItem } from '@mui/material'
import DashboardLayout from '../../../components/Layouts/DashboardLayout'
import { getSelectOptions } from '../../../utils/InputHelpers'
import { useAddEditCustomerDetails } from './hooks/useAddEditCustomerDetails'
import { DesignationOptions } from '../../../constant/customers'
import { Link } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import ConfirmationDialog from '../../../components/ConfirmationDialog'
import { useFormikProps } from '../../../hooks/useFormikProps'
import { MembershipTypes, BooleanTypes } from '../helper'
export const AddEditCustomerDetail = () => {
    const {
        customer,
        organisation,
        formikProps,
        form,
        refresh,
        disableForm,
        handleFormEditCancel,
        onBlacklist,
        onMarkVerified,
        goldMembershipForm,
    } = useAddEditCustomerDetails()
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({
        openBlacklistConfirmDialog: false,
    })
    const goldMembershipFormikProps = useFormikProps(goldMembershipForm)

    return (
        <DashboardLayout loading={refresh}>
            <ConfirmationDialog
                content={
                    <>
                        <Typography variant="h5">Blacklist Customer?</Typography>
                        <Typography pt={3}>
                            <Typography component="span" color="error">
                                <strong> Disclaimer:</strong>
                            </Typography>{' '}
                            Blacklisted Customers will be logged out and will not be able to login again into the
                            ProjectHero Customer App or WebApp.
                        </Typography>
                    </>
                }
                cancel={() => {
                    setConfirmationDialogProps({ openBlacklistConfirmDialog: false })
                }}
                confirm={() => {
                    onBlacklist()
                    setConfirmationDialogProps({ openBlacklistConfirmDialog: false })
                }}
                open={confirmationDialogProps.openBlacklistConfirmDialog}
            />
            <Stack
                component={'form'}
                onSubmit={form.handleSubmit}
                alignItems="stretch"
                margin="0 auto"
                maxWidth={1000}
                spacing={2}
            >
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1}>
                        <Typography variant="h4">Customer Details</Typography>
                        {!!customer?.isBlacklisted && (
                            <Chip
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.error.dark,
                                    color: theme.palette.primary.contrastText,
                                    height: '36px',
                                })}
                                label="Blacklisted"
                            />
                        )}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Link to={`/orders?customerId=${customer?.customerId}`}>
                            <Button variant="outlined">View Orders </Button>
                        </Link>
                        <Link to={`/projects/create/${customer?.customerId}`}>
                            <Button variant="outlined">Create Project </Button>
                        </Link>
                        {!customer?.isBlacklisted && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setConfirmationDialogProps({ openBlacklistConfirmDialog: true })}
                            >
                                Blacklist
                            </Button>
                        )}
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
                        <Grid item xs={5}>
                            <InputLabel>Phone Number</InputLabel>
                            <Typography>{customer?.phoneNumber ?? 'NA'}</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <InputLabel>Status</InputLabel>
                            <Typography>{customer?.customerStatus ?? 'NA'}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={1} justifyContent={'space-between'}>
                        <Grid item xs={3}>
                            <InputLabel>Verification Status</InputLabel>
                            <Typography>{customer?.customerVerification?.verificationStatus ?? 'NA'}</Typography>
                        </Grid>
                        {customer?.customerVerification?.verificationStatus !== 'FULLY_VERIFIED' && (
                            <Button variant="contained" onClick={() => onMarkVerified()}>
                                Mark as Verified
                            </Button>
                        )}
                    </Grid>
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={1} justifyContent={'space-between'}>
                        {/* <Grid item xs={3}>
                            <InputLabel>Membership Status</InputLabel>
                            <Typography>{customer?.customerMembership?.type ?? 'NA'}</Typography>
                        </Grid> */}
                        <Grid item xs={3}>
                            <Select fullWidth {...goldMembershipFormikProps('membershipType')} >
                                <MenuItem value="none">Select Membership Type </MenuItem>
                                {getSelectOptions(MembershipTypes)}
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <Select fullWidth {...goldMembershipFormikProps('freeTrial')} >
                                <MenuItem value="none"> isFree Trial? </MenuItem>
                                {getSelectOptions(BooleanTypes)}
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                        <TextField
                        fullWidth
                                    label="Add Enter amount"
                                    placeholder="amount"
                                    {...goldMembershipFormikProps('amount')}
                                />
                        </Grid>
                        <Grid item xs={3}>
                        <TextField
                        fullWidth
                                    label="Add validity in days"
                                    placeholder="validity"
                                    {...goldMembershipFormikProps('validity')}
                                />
                        </Grid>
                        <Grid item xs={4}>
                        <Button variant="contained" onClick={goldMembershipForm.handleSubmit}>
                                    Mark as Member
                        </Button>
                        </Grid>
                       
                        {/* {(
                            <>
                                <TextField
                                    label="Add Enter amount"
                                    placeholder="amount"
                                    {...goldMembershipFormikProps('amount')}
                                />
                                <Button variant="contained" onClick={goldMembershipForm.handleSubmit}>
                                    Mark as Member
                                </Button>
                            </>
                        )} */}
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
                                disabled={disableForm || organisation}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="GSTIN"
                                {...formikProps('gstin')}
                                disabled={disableForm || organisation}
                            />
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
