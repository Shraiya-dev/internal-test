import { Button, Grid, InputAdornment, LinearProgress, Link, Pagination, Paper, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { QueryField } from '../../components/queryInputs'
import { ADD_CUSTOMER_ROUTE } from '../../routes'
import { validateEmail } from '../../utils/optionHelpers'
import { EditOrgCustomer } from './EditOrgCustomer'
import { useCustomer } from './hooks/useCustomer'

export const Customer = () => {
    const { columns, isLoading, customers, hasMore, getCustomer, editOrgCustomerProps } = useCustomer()
    const [sp, setSp] = useSearchParams()
    const navigate = useNavigate()

    return (
        <>
            <EditOrgCustomer {...editOrgCustomerProps} />
            <DashboardLayout>
                <Grid item display="flex">
                    <Typography variant="h4" fontWeight={600} flexGrow={1}>
                        Manage Customer
                    </Typography>
                    <Button variant="contained" onClick={() => navigate(ADD_CUSTOMER_ROUTE)}>
                        Add Customer
                    </Button>
                </Grid>
                <Paper
                    elevation={0}
                    sx={{
                        mt: 2,
                        p: 2,
                    }}
                >
                    <Grid container spacing={2}>
                        {/* <Grid item>
                            <QueryField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                label="Company Name"
                                name="companyName"
                                placeholder="Enter company name"
                            />
                        </Grid> */}
                        <Grid item>
                            <QueryField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                label="Customer Phone"
                                placeholder="Enter Customer Number"
                                validation={(val) => val.length <= 10 && !isNaN(Number(val))}
                                error={sp.get('customerPhone') && sp.get('customerPhone').length < 10}
                                name="customerPhone"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <QueryField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                error={sp.get('customerEmail') && !validateEmail(sp.get('customerEmail'))}
                                label="Customer Email"
                                name="customerEmail"
                                placeholder="Enter Customer Email"
                            />
                        </Grid>
                        <Grid item>
                            <QueryField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                label="Organisation Id"
                                name="organisationId"
                                placeholder="Enter Customer Name"
                            />
                        </Grid>

                        <Grid item display="flex">
                            <Button variant="contained" onClick={() => getCustomer(sp)}>
                                Search
                            </Button>
                        </Grid>
                        {/* <Grid item display="flex">
                      <QueryReset>Clear Filters</QueryReset>
                  </Grid> */}
                    </Grid>
                </Paper>
                <Paper sx={{ mt: 2, height: '70vh', width: '100%', p: 2 }}>
                    <DataGrid
                        disableColumnFilter
                        disableSelectionOnClick
                        disableColumnSelector
                        columns={columns}
                        rows={customers}
                        pageSize={100}
                        rowsPerPageOptions={[5]}
                        rowCount={100}
                        getRowId={(row) => row.customerId}
                        paginationMode="server"
                        loading={isLoading}
                        components={{
                            LoadingOverlay: LinearProgress,

                            Pagination: () => (
                                <>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Typography> Customer: {customers.length}</Typography>
                                        <Pagination
                                            page={sp.get('pageNumber') ? Number(sp.get('pageNumber')) : 1}
                                            hidePrevButton={
                                                !Number(sp.get('pageNumber')) || Number(sp.get('pageNumber')) === 1
                                            }
                                            hideNextButton={!hasMore}
                                            count={hasMore ? 10000 : Number(sp.get('pageNumber'))}
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
        </>
    )
}
