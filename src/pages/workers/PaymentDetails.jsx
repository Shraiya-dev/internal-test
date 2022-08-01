import { LoadingButton } from '@mui/lab'
import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { AddEditPaymentDetailsDialog } from './AddEditPaymentDetailsDialog'
import { usePaymentDetails } from './hooks/usePaymentDetails'

export const PaymentDetails = ({ uid, userType }) => {
    const { paymentDetails, form, closeDialog, dialogOpen } = usePaymentDetails(uid, userType)

    return (
        <>
            <Stack p={2}>
                <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                    <h3>Payment Details</h3>

                    <LoadingButton variant="contained" onClick={closeDialog}>
                        {paymentDetails ? 'Edit' : 'Add'}
                    </LoadingButton>
                </Stack>
                {paymentDetails ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Type: </strong>
                                {paymentDetails?.type}
                            </Typography>
                        </Grid>
                        {paymentDetails?.type === 'BANK_ACCOUNT' ? (
                            <>
                                <Grid item xs={4}>
                                    <Typography>
                                        <strong>Account Holder Name: </strong>
                                        {paymentDetails?.details?.name}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        <strong>Account Number: </strong>
                                        {paymentDetails?.details?.accountNumber}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        <strong>IFSC: </strong>
                                        {paymentDetails?.details?.ifsc}
                                    </Typography>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={4}>
                                    <Typography>
                                        <strong>Customer Name: </strong>
                                        {paymentDetails?.details?.customerName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <strong>VPA: </strong>
                                        {paymentDetails?.details?.vpa}
                                    </Typography>
                                </Grid>
                            </>
                        )}
                    </Grid>
                ) : (
                    <Typography color="grey.A400" variant="h5">
                        Not Found
                    </Typography>
                )}
            </Stack>
            <AddEditPaymentDetailsDialog form={form} open={dialogOpen} cancel={closeDialog} />
        </>
    )
}
