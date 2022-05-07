import { Search } from '@material-ui/icons'
import { Edit } from '@mui/icons-material'
import DownloadIcon from '@mui/icons-material/Download'
import { LoadingButton } from '@mui/lab'
import { Box, Button, IconButton, InputAdornment, Pagination, Paper, Stack, TextField, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import { DataGrid } from '@mui/x-data-grid'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { isEqual, isSameDay, parse } from 'date-fns'
import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { isANumber } from '../../utils'
import EditAttendanceDialog from './EditAttendanceDialog'
import useAttendance from './hooks/useAttendance'

export const AttendanceComponent = () => {
    const { form, response, isLoading, isDownloading, downloadEmployeeHistoryWithFilters, refreshPage } =
        useAttendance()
    const [sp, setSp] = useSearchParams()

    const [EditAttendanceDialogProps, setEditAttendanceDialogProps] = useState({
        field: undefined,
        open: false,
        data: undefined,
        onClose: undefined,
    })

    const { hasMore, workerData } = response

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
        // {
        //     field: 'companyName',
        //     headerName: <h4>Company Name</h4>,
        //     width: 150,
        // },
        // {
        //     field: 'siteAddress',
        //     headerName: <h4>Site Address</h4>,
        //     width: 150,
        // },
        {
            field: 'attendance',
            headerName: <h4>Check In / Check Out</h4>,
            width: 230,
            renderCell: (params) => {
                return (
                    <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between" alignItems={'center'}>
                        <Typography>
                            {params.row.checkIn ?? 'NA'} / {params.row.checkOut ?? 'NA'}
                        </Typography>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                                setEditAttendanceDialogProps({
                                    field: 'attendance',
                                    open: true,
                                    data: params.row,
                                    onClose: () => {
                                        setEditAttendanceDialogProps({
                                            open: false,
                                            data: undefined,
                                        }),
                                            refreshPage()
                                    },
                                })
                            }}
                        >
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </Stack>
                )
            },
        },
        {
            field: 'ot',
            headerName: <h4> OT Check In / OT Check Out</h4>,
            width: 280,
            renderCell: (params) => {
                return (
                    <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between" alignItems={'center'}>
                        <Typography>
                            {params.row.otCheckInTime ?? 'NA'} / {params.row.otCheckOutTime ?? 'NA'}
                        </Typography>
                        <IconButton
                            size="small"
                            color="primary"
                            disabled={!(params.row.checkIn && params.row.checkOut)}
                            onClick={() => {
                                setEditAttendanceDialogProps({
                                    field: 'ot',
                                    open: true,
                                    data: params.row,
                                    onClose: () => {
                                        setEditAttendanceDialogProps({
                                            open: false,
                                            data: undefined,
                                        }),
                                            refreshPage()
                                    },
                                })
                            }}
                        >
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </Stack>
                )
            },
        },
        {
            field: 'earnings',
            headerName: <h4>Total / Fixed / OT / PF / ESI </h4>,
            width: 300,
            renderCell: (params) => {
                return (
                    <>
                        &#8377; {params.row.total ?? 'NA'} / &#8377; {params.row.fixed ?? 'NA'} / &#8377;{' '}
                        {params.row.ot ?? 'NA'} / &#8377;
                        {params.row.pf ?? 'NA'} / &#8377; {params.row.esi ?? 'NA'}
                    </>
                )
            },
        },
        {
            field: 'wage',
            headerName: <h4>Wage</h4>,
            width: 100,
            renderCell: (params) => {
                return <> &#8377; {params.row.wage}</>
            },
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

    return (
        <DashboardLayout>
            <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                <Typography variant="h4" fontWeight={600} align="center">
                    Manage Attendance
                </Typography>
                <Stack direction="row" spacing={2}>
                    <LoadingButton
                        loading={isDownloading}
                        loadingPosition="start"
                        type="download"
                        startIcon={<DownloadIcon />}
                        color="primary"
                        variant="outlined"
                        onClick={downloadEmployeeHistoryWithFilters}
                    >
                        DOWNLOAD
                    </LoadingButton>
                    <Button
                        type="download"
                        color="primary"
                        variant="contained"
                        disabled={!isSameDay(new Date(), parse(sp.get('date'), 'dd/MM/yy', new Date()))}
                        onClick={() => {
                            setEditAttendanceDialogProps({
                                open: true,
                                onClose: () => {
                                    setEditAttendanceDialogProps({ open: false })
                                    refreshPage()
                                },
                            })
                        }}
                    >
                        Add Attendance
                    </Button>
                </Stack>
            </Box>
            <Paper>
                <form onSubmit={form.handleSubmit}>
                    <Stack
                        direction="row"
                        p={2}
                        mt={2}
                        sx={{
                            '&>*': {
                                mr: '8px !important',
                                width: 200,
                            },
                        }}
                    >
                        <TextField
                            label="Customer PhoneNumber"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            name="customerPhoneNumber"
                            value={form.values.customerPhoneNumber}
                            onChange={(e) => {
                                if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                                    form.handleChange(e)
                                }
                            }}
                        />
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                            }}
                            placeholder="BookingId"
                            label="Booking ID"
                            name="bookingId"
                            value={form.values.bookingId}
                            onChange={form.handleChange}
                        />
                        <TextField
                            label="Worker PhoneNumber"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            name="workerPhoneNumber"
                            value={form.values.workerPhoneNumber}
                            onChange={(e) => {
                                if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                                    form.handleChange(e)
                                }
                            }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date"
                                disableFuture
                                inputFormat="dd/MM/yyyy"
                                value={form.values.date}
                                onChange={(date) => {
                                    form.setFieldValue('date', date)
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <Button type="submit" startIcon={<Search />} color="primary" variant="contained">
                            search
                        </Button>
                    </Stack>
                </form>
                <Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
                    <DataGrid
                        disableColumnFilter
                        disableSelectionOnClick
                        disableColumnSelector
                        // rows={workerData}
                        rows={workerData.map((val) => ({ ...val, id: val.workerId }))}
                        rowCount={100}
                        columns={columns}
                        pageSize={100}
                        paginationMode="server"
                        components={{
                            LoadingOverlay: LinearProgress,

                            Pagination: () => (
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
                            ),
                        }}
                        loading={isLoading}
                    />
                </Paper>
                <EditAttendanceDialog {...EditAttendanceDialogProps} />
            </Paper>
        </DashboardLayout>
    )
}
