import { Search } from '@material-ui/icons'
import { Download } from '@mui/icons-material'
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab'
import {
    Box,
    Button,
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
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { ADD_WORKER_ROUTE } from '../../routes'
import { cities, states } from '../../utils/data'
import { getSelectOptions } from '../../utils/InputHelpers'
import { jobTypeOptions } from '../workers/helper'
import { useWorkerInfo } from './hooks/useWorkerInfo'
import { currentlyOperationalCities } from '../workers/helper'
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
]

export default function DataTable() {
    const { checkError, form, response, isLoading, downloadWorkersWithFilters, isDownloading } = useWorkerInfo()
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
                    to={`/bookings/${params?.row.bookingId}`}
                >
                    {params?.row?.bookingId}
                </Link>
            ),
        },
        { field: 'state', headerName: <h4>State</h4>, width: 150 },
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

                        {/* <Select
                            variant="outlined"
                            name="state"
                            value={form.values.state}
                            onChange={(e) => {
                                form.setFieldValue('city', 'none')
                                form.handleChange(e)
                            }}
                        >
                            <MenuItem value={'none'}>Select State</MenuItem>
                            {getSelectOptions(states) ?? []}
                        </Select> */}

                        <Select
                            name="city"
                            variant="outlined"
                            // disabled={form.values.state === 'none'}
                            value={form.values.city}
                            onChange={form.handleChange}
                        >
                            {getSelectOptions(currentlyOperationalCities ?? [])}
                        </Select>

                        <Select
                            name="jobType"
                            variant="outlined"
                            value={form.values.jobType}
                            onChange={form.handleChange}
                        >
                            <MenuItem value={'none'}>Job Type</MenuItem>
                            {getSelectOptions(jobTypeOptions)}
                        </Select>

                        <TextField
                            name="phone"
                            error={!!checkError('phone')}
                            onChange={(e) => {
                                if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                                    form.handleChange(e)
                                }
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
                                }}
                            />
                        ),
                    }}
                    loading={isLoading}
                />
            </Paper>
        </DashboardLayout>
    )
}
