import { Paper, Stack } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PaymentDetails } from '../workers/PaymentDetails'

export const AddEditPartner = () => {
    const { partnerId } = useParams()
    return (
        <>
            <DashboardLayout>
                <Stack alignItems="stretch" margin="0 auto" px={2} maxWidth={1000}>
                    {partnerId && (
                        <Paper sx={{ p: 2 }}>
                            <PaymentDetails uid={partnerId} userType="partner" />
                        </Paper>
                    )}
                </Stack>
            </DashboardLayout>
        </>
    )
}
