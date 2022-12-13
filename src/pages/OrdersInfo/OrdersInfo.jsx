import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { ADD_ORDERS_ROUTE } from '../../routes'

export const Orders = () => {
    return (
        <DashboardLayout>
            <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                <Typography variant="h4" fontWeight={600} align="center">
                    Manage Orders
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Link to={ADD_ORDERS_ROUTE}>
                        <Button
                            sx={{
                                mb: 2,
                                height: 48,
                            }}
                            variant="contained"
                        >
                            Add Order
                        </Button>
                    </Link>
                </Stack>
            </Box>
        </DashboardLayout>
    )
}
