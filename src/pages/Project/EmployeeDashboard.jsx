import React, { useMemo, useState } from 'react'
import { Stack, Typography, Paper, Button, InputAdornment, LinearProgress, Grid, Pagination } from '@mui/material'
import { QueryField, QueryMultiSelect, QueryReset, QuerySelect } from '../../components/queryInputs'
import { getSelectOptions } from '../../utils/InputHelpers'
import { JobTypeOptions } from '../../constant/booking'
import { EmployeeStatusOption, HiringChannels } from '../../constant/project'
import { SkillTypes } from '../../constant/job'
import { DataGrid } from '@mui/x-data-grid'
import { AddEmployee } from './AddEmployee'
import { useEmployeeDashboard } from './hooks/useEmployeeDashboard'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEmployeeActions } from './hooks/useEmployeeAction'
import EmploymentCompleteDialog from '../jobCards/EmploymentCompleteDialog'
import ConfirmationDialog from '../../components/ConfirmationDialog'

const EmployeeDashboard = () => {
    const [sp, setSp] = useSearchParams()
    const { employees, hasMore, isLoading, refreshList } = useEmployeeDashboard()
    const [employmentCompleteDialogProps, setEmploymentCompleteDialog] = useState({ open: false })

    const [confirmDialogProps, setConfirmDialogProps] = useState({
        content: '',
        open: false,
        cancel: () => {},
        confirm: () => {},
    })

    const { terminateEmployee, completeEmployment, addEmployeeToProject } = useEmployeeActions()
    const dataGridColumns = useMemo(
        () => [
            {
                field: 'name',
                headerName: 'Name',
                width: 150,
                renderCell: (params) => (
                    <Link to={`/workers/${params?.row?.workerId}`}>
                        <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                            {params?.row.name || 'No name'}
                        </Typography>
                    </Link>
                ),
            },
            {
                field: 'employeeStatus',
                headerName: 'Employee Status',
                width: 250,
            },
            {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                width: 150,
            },
            {
                field: 'jobType',
                headerName: 'Job Type',
                width: 150,
            },
            {
                field: 'skillType',
                headerName: 'Skill Type',
                width: 150,
            },
            {
                field: 'hiringChannel',
                headerName: 'Hiring Channel',
                width: 150,
            },

            {
                field: 'bookingId',
                headerName: 'Booking ID',
                width: 150,
                renderCell: (params) => (
                    <Link
                        style={{
                            textDecoration: 'underline',
                            color: '#244CB3',
                        }}
                        to={`/bookings/${params?.row.bookingId}`}
                    >
                        {params?.row?.bookingId}
                    </Link>
                ),
            },

            {
                field: 'employmentStartDate',
                headerName: 'Start Date',
                width: 200,
            },
            {
                field: 'employmentEndDate',
                headerName: 'End Date',
                width: 200,
            },
            {
                field: 'action',
                headerName: 'Actions',
                width: 500,
                renderCell: (params) => {
                    return (
                        params.row.employeeStatus === 'EMPLOYMENT_STARTED' && (
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setEmploymentCompleteDialog({
                                            open: true,
                                            setOpen: setEmploymentCompleteDialog,
                                            confirm: async (values) => {
                                                await terminateEmployee(params.row?.employeeId, values)
                                                refreshList()
                                            },
                                        })
                                    }}
                                >
                                    Terminate Employee
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setConfirmDialogProps({
                                            open: true,
                                            content: (
                                                <>
                                                    Complete <strong>Employment</strong> for this hero?
                                                </>
                                            ),
                                            cancel: () => {
                                                setConfirmDialogProps({ open: false })
                                                refreshList()
                                            },
                                            confirm: () => {
                                                completeEmployment(params.row?.employeeId)
                                                setConfirmDialogProps({ open: false })
                                                refreshList()
                                            },
                                        })
                                    }}
                                >
                                    Complete Employment
                                </Button>
                            </Stack>
                        )
                    )
                },
            },
        ],
        [terminateEmployee, refreshList, sp]
    )

    return (
        <>
            <EmploymentCompleteDialog {...employmentCompleteDialogProps} />
            <ConfirmationDialog {...confirmDialogProps} />

            <Paper sx={{ px: 2 }}>
                <Grid container>
                    <Grid item container spacing={1}>
                        <Grid item>
                            <QueryField
                                sx={{ width: 200 }}
                                variant="outlined"
                                label="Worker Phone"
                                placeholder="Enter Phone Number"
                                validation={(val) => val.length <= 10 && !isNaN(Number(val))}
                                name="phoneNumber"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <QuerySelect sx={{ width: 200 }} name="hiringChannel">
                                {getSelectOptions(HiringChannels)}
                            </QuerySelect>
                        </Grid>

                        <Grid item>
                            <QuerySelect sx={{ width: 200 }} name="jobType">
                                {getSelectOptions(JobTypeOptions)}
                            </QuerySelect>
                        </Grid>

                        <Grid item>
                            <QuerySelect sx={{ width: 200 }} name="skillType">
                                {getSelectOptions(SkillTypes)}
                            </QuerySelect>
                        </Grid>

                        <Grid item>
                            <QuerySelect sx={{ width: 200 }} name="employeeStatus">
                                {getSelectOptions(EmployeeStatusOption)}
                            </QuerySelect>
                        </Grid>

                        <Grid display="flex" item>
                            <Button variant="contained" onClick={() => getJobCards(sp)}>
                                Search
                            </Button>
                        </Grid>
                        <Grid display="flex" item>
                            <QueryReset except={['tab']}>Clear Filters</QueryReset>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ height: '67vh', width: '100%', px: 2, mt: 2 }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            fontWeight: 900,
                        },
                    }}
                    disableColumnFilter
                    disableSelectionOnClick
                    disableColumnSelector
                    rows={employees ?? 0}
                    getRowId={(row) => row?.employeeId ?? new Date()}
                    rowCount={'fit-content'}
                    columns={dataGridColumns}
                    pageSize={100}
                    paginationMode="server"
                    components={{
                        LoadingOverlay: LinearProgress,

                        Pagination: () => (
                            <>
                                <Stack direction="row" alignItems="center">
                                    Employees: {employees?.length ?? 0}
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
                    loading={isLoading}
                />
            </Paper>
        </>
    )
}

export default EmployeeDashboard
