import {
    Box,
    Button,
    Grid,
    InputAdornment,
    LinearProgress,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { QueryField, QueryReset } from '../../components/queryInputs'
import { useProject } from './hooks/useProject'

const Project = () => {
    const { columns, isLoading, projects, hasMore, getProjects } = useProject()
    const [sp, setSp] = useSearchParams()
    return (
        <DashboardLayout>
            <Typography variant="h4" fontWeight={600}>
                Manage Projects
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <QueryField
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
                            variant="outlined"
                            label="Project Name"
                            name="name"
                            placeholder="Enter Project name"
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
                        <Button variant="contained" onClick={() => getProjects(sp)}>
                            Search
                        </Button>
                    </Grid>
                    <Grid item display="flex">
                        <QueryReset>Clear Filters</QueryReset>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
                <DataGrid
                    disableColumnFilter
                    disableSelectionOnClick
                    disableColumnSelector
                    columns={columns}
                    rows={projects}
                    pageSize={100}
                    rowsPerPageOptions={[5]}
                    rowCount={100}
                    paginationMode="server"
                    loading={isLoading}
                    components={{
                        LoadingOverlay: LinearProgress,

                        Pagination: () => (
                            <>
                                <Stack direction="row" alignItems="center">
                                    Projects: {projects.length}
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

export default Project
