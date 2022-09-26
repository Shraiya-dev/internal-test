import { Search } from '@material-ui/icons'
import { Download, Upload, WorkspacePremium } from '@mui/icons-material'
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab'
import {
    Box,
    Button,
    InputAdornment,
    LinearProgress,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import axios from 'axios'
import React, { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FileInput } from '../../components/CustomInputs'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useLocationMetadata } from '../../hooks/useLocationMetadata'
import { ADD_WORKER_ROUTE } from '../../routes'
import { getSelectOptions } from '../../utils/InputHelpers'
import { JobTypeOptions } from '../../utils/optionHelpers'
import { useWorkerInfo } from './hooks/useWorkerInfo'
const statusValue = [
    {
        value: 'none',
        label: 'Select Status',
    },
    {
        value: 'EMPLOYED',
        label: 'Employed',
    },
    {
        value: 'AVAILABLE',
        label: 'Available',
    },
    ,
    {
        value: 'REGISTERED',
        label: 'Registered',
    },
    {
        value: 'CONFIRMED',
        label: 'Confirmed',
    },
]

const skillType = [
    {
        value: 'none',
        label: 'Select Skill',
    },
    {
        value: 'TECHNICIAN',
        label: 'Technician',
    },
    {
        value: 'SUPERVISOR',
        label: 'Supervisor',
    },
    {
        value: 'HELPER',
        label: 'Helper',
    },
]

export default function DataTable() {
    const { checkError, form, response, isLoading, downloadWorkersWithFilters, handelBulkVerification, isDownloading } =
        useWorkerInfo()
    const { states, districts, setStateId } = useLocationMetadata()

    const columns = [
        // { field: 'id', headerName: <h4>ID</h4>, width: 220 },

        {
            field: 'name',
            headerName: <h4>Name</h4>,
            width: 150,
            renderCell: (params) => (
                <Link to={`/workers/${params?.id}`}>
                    <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                        {params?.row.name || 'No name'}
                    </Typography>
                </Link>
            ),
        },
        {
            field: 'status',
            headerName: <h4>Status</h4>,
            width: 150,
        },
        {
            field: 'phoneNumber',
            headerName: <h4>Phone Number</h4>,
            width: 150,
        },
        {
            field: 'jobType',
            headerName: <h4>JobType</h4>,
            width: 150,
        },
        {
            field: 'skillType',
            headerName: <h4>Skill type</h4>,
            width: 150,
        },

        {
            field: 'bookingId',
            headerName: <h4>Booking ID</h4>,
            width: 150,
            renderCell: (params) => (
                <Link
                    style={{
                        textDecoration: 'underline',
                        color: '#244CB3',
                    }}
                    to={`/bookings/${params?.row?.bookingId}`}
                >
                    {params?.row?.bookingId}
                </Link>
            ),
        },
        {
            field: 'projectId',
            headerName: <h4>Project ID</h4>,
            width: 150,
            renderCell: (params) => (
                <Link
                    style={{
                        textDecoration: 'underline',
                        color: '#244CB3',
                    }}
                    to={`/projects/${params?.row?.projectId}`}
                >
                    {params?.row?.projectId}
                </Link>
            ),
        },
        {
            field: 'onboardingDetails?.type',
            headerName: <h4>Onboarding Channel</h4>,
            width: 200,
            renderCell: (params) => {
                return params?.row?.onboardingDetails?.type ?? ''
            },
        },
        {
            field: 'state',
            headerName: <h4>State</h4>,
            width: 150,
        },
        {
            field: 'city',
            headerName: <h4>City</h4>,
            width: 150,
        },
    ]

    const { hasMore, workerData } = response

    const [sp, setSp] = useSearchParams()

    return (
        <DashboardLayout>
            <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                <Typography variant="h4" fontWeight={600} align="center">
                    Manage Workers
                </Typography>
                <Stack direction="row" spacing={2}>
                    <LoadingButton
                        loading={isDownloading}
                        loadingPosition="start"
                        disabled={!sp.get('createdAt')}
                        sx={{
                            mb: 2,
                            height: 48,
                        }}
                        startIcon={<Download />}
                        variant="outlined"
                        onClick={downloadWorkersWithFilters}
                    >
                        Download
                    </LoadingButton>
                    <Link to={ADD_WORKER_ROUTE}>
                        <Button
                            sx={{
                                mb: 2,
                                height: 48,
                            }}
                            variant="contained"
                        >
                            Add Worker
                        </Button>
                    </Link>
                    <FileInput
                        sx={{
                            mb: 2,
                            height: 48,
                        }}
                        id="uploadBulkVerificationFile"
                        label="Worker bulk Verification"
                        variant={'contained'}
                        startIcon={<Upload />}
                        onChange={(e) => {
                            handelBulkVerification(e.target.files[0])
                            e.target.value = ''
                        }}
                        type="file"
                        accept=".xls,.xlsx"
                    />
                </Stack>
            </Box>
            <Paper>
                <form onSubmit={form.handleSubmit}>
                    <Stack
                        direction="row"
                        p={2}
                        sx={{
                            '&>*': {
                                mr: '8px !important',
                                width: 200,
                            },
                        }}
                    >
                        <Select value={form.values.status} name="status" onChange={form.handleChange}>
                            {statusValue.map((item) => {
                                return (
                                    <MenuItem value={item.value} key={item.value}>
                                        {item.label}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                        <TextField
                            name="workerName"
                            error={!!checkError('workerName')}
                            value={form.values.workerName}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            variant="outlined"
                            label="Search Worker Name"
                        />

                        <Select
                            variant="outlined"
                            name="state"
                            value={form.values.state}
                            onChange={(e) => {
                                form.setFieldValue('city', 'none')
                                form.handleChange(e)
                                setStateId(e.target.value)
                            }}
                        >
                            <MenuItem value={'none'}>Select State</MenuItem>
                            {states.map((item) => <MenuItem value={item.value}>{item.label}</MenuItem>) ?? []}
                        </Select>
                        <Select
                            name="city"
                            variant="outlined"
                            disabled={form.values.state === 'none'}
                            value={form.values.city}
                            onChange={form.handleChange}
                        >
                            <MenuItem value={'none'}>Select District</MenuItem>
                            {districts.map((item) => <MenuItem value={item.value}>{item.label}</MenuItem>) ?? []}
                        </Select>

                        <Select
                            name="jobType"
                            variant="outlined"
                            value={form.values.jobType}
                            onChange={form.handleChange}
                        >
                            <MenuItem value={'none'}>Job Type</MenuItem>
                            {getSelectOptions(JobTypeOptions)}
                        </Select>

                        {/* Skill type */}

                        <Select value={form.values.skillType} name="skillType" onChange={form.handleChange}>
                            {skillType.map((item) => {
                                return (
                                    <MenuItem value={item.value} key={item.value}>
                                        {item.label}
                                    </MenuItem>
                                )
                            })}
                        </Select>

                        <TextField
                            name="phone"
                            error={!!checkError('phone')}
                            onChange={(e) => {
                                if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                                    form.handleChange(e)
                                }
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            onBlur={form.handleBlur}
                            variant="outlined"
                            label="Search By Phone"
                            value={form.values.phone}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Created Date"
                                disableFuture
                                inputFormat="dd/MM/yyyy"
                                value={form.values.createdAtDate}
                                onChange={(date) => {
                                    form.setFieldValue('createdAtDate', date)
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <Button type="submit" startIcon={<Search />} color="primary" variant="contained">
                            search
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
                <DataGrid
                    disableColumnFilter
                    disableSelectionOnClick
                    disableColumnSelector
                    rows={workerData.map((val) => ({ ...val, id: val.workerId }))}
                    rowCount={100}
                    columns={columns}
                    pageSize={100}
                    paginationMode="server"
                    components={{
                        LoadingOverlay: LinearProgress,

                        Pagination: () => (
                            <>
                                <Stack direction="row" alignItems="center">
                                    Workers: {workerData.length}
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
        </DashboardLayout>
    )
}
