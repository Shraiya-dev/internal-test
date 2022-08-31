import { TabContext, TabPanel } from '@mui/lab'
import { Paper, Tab, Tabs, Stack, Grid, Typography, Button, LinearProgress, Pagination } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useSearchParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import AddEditProject from './AddEditProject'
import { useProjectDetails } from './provider/ProjectProvider'
import EmployeeDashboard from './EmployeeDashboard'
import { useEmployeeActions } from './hooks/useEmployeeAction'
import { AddEmployee } from './AddEmployee'
import { useEmployeeDashboard } from './hooks/useEmployeeDashboard'
import EmploymentCompleteDialog from '../jobCards/EmploymentCompleteDialog'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { QueryField, QueryReset, QuerySelect } from '../../components/queryInputs'
import { InputAdornment } from '@material-ui/core'
import { getSelectOptions } from '../../utils/InputHelpers'
import { EmployeeStatusOption, HiringChannels } from '../../constant/project'
import { JobTypeOptions } from '../../constant/booking'
import { SkillTypes } from '../../constant/job'
import { DataGrid } from '@mui/x-data-grid'
const ProjectById = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const handelTabChange = useCallback((e, val) => {
        const nsp = new URLSearchParams(searchParams)
        nsp.set('tab', val)
        setSearchParams(nsp)
    }, [])
    const [addEmployeeProps, setAddEmployeeProps] = useState({
        open: false,
        onClose: undefined,
        onConfirm: undefined,
    })
    const { customer, project } = useProjectDetails()
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
        <DashboardLayout>
            <AddEmployee {...addEmployeeProps} />

            <TabContext value={searchParams.get('tab') ?? 'details'}>
                <Paper>
                    <Grid container px={2} spacing={2}>
                        <Grid item>
                            <Typography variant="h4">{project?.name}</Typography>
                            <Typography variant="caption">Company Name: {customer?.companyName}</Typography>
                        </Grid>
                        <Grid ml="auto" display="flex" item>
                            <Link style={{ display: 'flex' }} to={`/projects/${project?._id}/booking/create`}>
                                <Button fullWidth variant="outlined">
                                    create Booking
                                </Button>
                            </Link>
                        </Grid>
                        <Grid display="flex" item>
                            <Button
                                fullWidth
                                onClick={() => {
                                    setAddEmployeeProps({
                                        open: true,
                                        onClose: () => {
                                            setAddEmployeeProps({ open: false })
                                        },
                                        onConfirm: async (values) => {
                                            await addEmployeeToProject(values)
                                            refreshList()
                                        },
                                    })
                                }}
                                variant="contained"
                            >
                                Add Employee
                            </Button>
                        </Grid>
                        <Grid display="flex" item>
                            <Link style={{ display: 'flex' }} to={`/bookings?projectId=${project?._id}`}>
                                <Button fullWidth variant="outlined">
                                    View Bookings
                                </Button>
                            </Link>
                        </Grid>

                        <Grid display="flex" item>
                            <Link style={{ display: 'flex' }} to={`/attendance?projectId=${project?._id}`}>
                                <Button fullWidth variant="outlined">
                                    View Attendance
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Tabs value={searchParams.get('tab') ?? 'details'} onChange={handelTabChange}>
                        <Tab value="details" label="Project Details" />
                        <Tab value="employee" label="Manage Employees" />
                    </Tabs>
                    <TabPanel sx={{ maxHeight: '79vh', overflowY: 'auto', px: 0 }} value="details">
                        <AddEditProject />
                    </TabPanel>
                    <TabPanel sx={{ maxHeight: '79vh', overflowY: 'auto', px: 0 }} value="employee">
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
                                            error={sp.get('phoneNumber') && sp.get('phoneNumber').length < 10}
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
                                        <Button variant="contained" onClick={() => getEmployees(sp)}>
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
                                                        document.querySelector(
                                                            '.MuiDataGrid-virtualScroller'
                                                        ).scrollTop = 0
                                                    }}
                                                />
                                            </Stack>
                                        </>
                                    ),
                                }}
                                loading={isLoading}
                            />
                        </Paper>
                    </TabPanel>
                </Paper>
            </TabContext>
        </DashboardLayout>
    )
}

export default ProjectById
