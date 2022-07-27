import { Button, Dialog, Grid, LinearProgress, Pagination, Paper, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { QueryField } from '../../components/queryInputs'
import { useOrganization } from './hooks/useOrganization'
import { AddOrgMember } from '../Customer/AddOrgMember'
import { GSTINModal } from '../../components'
export const Organisation = () => {
    const {
        columns,
        isLoading,
        organisation: organisation,
        hasMore,
        getOrganizations,
        addOrgMemberProps,
        openGSTINModal,
        modalHandler,
    } = useOrganization()
    const [sp, setSp] = useSearchParams()
    return (
        <>
            <AddOrgMember {...addOrgMemberProps} />
            <DashboardLayout>
                <Typography variant="h4" fontWeight={600}>
                    Manage Organisation
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        mt: 2,
                        p: 2,
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item>
                            <QueryField
                                variant="outlined"
                                label="Organisation Id"
                                name="organisationId"
                                placeholder="Enter organisation Id"
                            />
                        </Grid>
                        <Grid item>
                            <QueryField
                                trim={false}
                                variant="outlined"
                                label="Company Name"
                                name="companyName"
                                placeholder="Enter company name"
                            />
                        </Grid>

                        <Grid item>
                            <QueryField
                                variant="outlined"
                                label="Domain Name"
                                name="domain"
                                placeholder="Enter domain name"
                            />
                        </Grid>
                        <Grid item display="flex">
                            <Button variant="contained" onClick={() => getOrganizations(sp)}>
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
                        rows={organisation}
                        pageSize={100}
                        rowsPerPageOptions={[5]}
                        rowCount={100}
                        paginationMode="server"
                        loading={isLoading}
                        getRowId={(row) => row.organisationId}
                        components={{
                            LoadingOverlay: LinearProgress,

                            Pagination: () => (
                                <>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Typography> Organisation: {organisation.length}</Typography>
                                        <Pagination
                                            page={sp.get('pageNumber') ? Number(sp.get('pageNumber')) : 1}
                                            hidePrevButton={
                                                !Number(sp.get('pageNumber')) || Number(sp.get('pageNumber')) === 1
                                            }
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
                {openGSTINModal?.open && <GSTINModal modalHandler={modalHandler} openGSTINModal={openGSTINModal} />}
            </DashboardLayout>
        </>
    )
}
