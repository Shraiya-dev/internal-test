import { Box, Button, LinearProgress, Pagination, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { ADD_ORDERS_ROUTE } from '../../routes'
import { DataGrid } from '@mui/x-data-grid'
import { useOrders } from './hooks/useOrders'

export const Orders = () => {
    const [sp, setSp] = useSearchParams()
    const { getOrders, hasMore, isLoading, orders } = useOrders()
    const columns = [
        {
            field: 'orderId',
            headerName: 'ID',
            width: 250,
            renderCell: (params) => (
                <Link to={`/orders/edit/${params?.id}`}>
                    <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                        {params?.row.orderId || 'N/A'}
                    </Typography>
                </Link>
            ),
        },
        {
            field: 'orderType',
            headerName: 'Order Type',
            width: 250,
            editable: true,
        },
        {
            field: 'startDateLabel',
            headerName: 'Start Date Label',
            width: 250,
        },
        {
            field: 'city',
            headerName: 'city',
            width: 150,
            editable: true,
        },
        {
            field: 'state',
            headerName: 'State',
            sortable: true,
            width: 150,
        },
        {
            field: 'isActive',
            headerName: 'Active',
            width: 250,
        },
        {
            field: 'orderValue',
            headerName: 'Order Value',
            width: 250,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    &#8377; {params.row.orderValue}
                </Stack>
            ),
        },

        // {
        //     field: 'addBooking',
        //     headerName: 'AddBooking',
        //     renderCell: (params) => (
        //         <Stack direction="row" spacing={1}>
        //             <Button variant="outlined">Create Booking</Button>
        //         </Stack>
        //     ),
        //     width: 400,
        // },
    ]
    return (
        <DashboardLayout>
            <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                <Typography variant="h4" fontWeight={600} align="center">
                    Manage Orders
                </Typography>
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
            <Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
                <DataGrid
                    disableColumnFilter
                    disableSelectionOnClick
                    disableColumnSelector
                    columns={columns}
                    rows={orders}
                    pageSize={100}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row.orderId}
                    rowCount={100}
                    paginationMode="server"
                    loading={isLoading}
                    components={{
                        LoadingOverlay: LinearProgress,

                        Pagination: () => (
                            <>
                                <Stack direction="row" alignItems="center">
                                    Orders: {0}
                                    <Pagination
                                        page={sp.get('pageNumber') ? Number(sp.get('pageNumber')) : 1}
                                        hideNextButton={!hasMore}
                                        count={hasMore ? 35 : Number(sp.get('pageNumber'))}
                                        siblingCount={0}
                                        disabled={isLoading}
                                        boundaryCount={0}
                                        showFirstButton={false}
                                        showLastButton={false}
                                        color="primary"
                                        onChange={(e, page) => {
                                            sp.set('pageNumber', page)
                                            setSp(sp)
                                            document.querySelector('.MuiDataGrid-virtualScroller').scrollTop = 0
                                        }}
                                    />
                                </Stack>
                            </>
                        ),
                    }}
                />
            </Paper>
        </DashboardLayout>
    )
}

const columns = []
