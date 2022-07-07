import { Download } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
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
    Tooltip,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { QueryField, QueryMultiSelect, QueryReset } from '../../components/queryInputs'
import { JobCardStates } from '../../constant/jobCards'
import { useJobCards } from './hooks/useJobCards'

export default function JCA() {
    const { isLoading, isDownloading, jobCards, hasMore, getJobCards, downloadJcaWithFilters } = useJobCards()

    const columns = [
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) => {
                return new Date(params?.row?.createdAt).toLocaleString()
            },
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            width: 150,
        },
        {
            field: 'id',
            headerName: 'Job Card ID',
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
                    to={`/bookings/${params?.row.bookingId}?jobCardStates=${params.row?.jobCardState}&skillTypes=${
                        params.row?.skillType
                    }&workerPhone=${params.row?.phoneNumber.replace('+91', '')}`}
                >
                    {params?.row?.bookingId}
                </Link>
            ),
        },
        {
            field: 'jobCardState',
            headerName: 'Job Card State',
            width: 300,
            flex: 'none',

            renderCell: (params) => {
                return (
                    <Stack width={300} alignItems="flex-start">
                        <Typography>{params?.row?.jobCardState}</Typography>
                        {params?.row?.cancellationDetails && (
                            <>
                                {params?.row?.cancellationDetails?.churnType && (
                                    <Tooltip title="Churn Type" placement="right-start">
                                        <Typography whiteSpace="wrap" variant="caption">
                                            {params?.row?.cancellationDetails?.churnType}
                                        </Typography>
                                    </Tooltip>
                                )}
                                {params?.row?.cancellationDetails?.reason && (
                                    <Tooltip title="Cancellation Reason" placement="right-start">
                                        <Typography whiteSpace="wrap" variant="caption">
                                            {params?.row?.cancellationDetails?.reason}
                                        </Typography>
                                    </Tooltip>
                                )}
                                {params?.row?.cancellationDetails?.details && (
                                    <Tooltip title="Cancellation Details" placement="right-start">
                                        <Typography whiteSpace="wrap" variant="caption">
                                            {params?.row?.cancellationDetails?.details}
                                        </Typography>
                                    </Tooltip>
                                )}
                            </>
                        )}
                        {params?.row?.completionDetails && (
                            <>
                                {params?.row?.completionDetails?.code && (
                                    <Tooltip title="Completion Code" placement="right-start">
                                        <Typography whiteSpace="wrap" variant="caption">
                                            {params?.row?.completionDetails?.code}
                                        </Typography>
                                    </Tooltip>
                                )}
                                {params?.row?.completionDetails?.partialCompletionReason && (
                                    <Tooltip title="Partial Completion Reason" placement="right-start">
                                        <Typography whiteSpace="wrap" variant="caption">
                                            {params?.row?.completionDetails?.partialCompletionReason}
                                        </Typography>
                                    </Tooltip>
                                )}
                                {params?.row?.completionDetails?.details && (
                                    <Tooltip title="Completion Details" placement="right-start">
                                        <Typography whiteSpace="wrap" component={'span'} variant="caption">
                                            {params?.row?.completionDetails?.details}
                                        </Typography>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </Stack>
                )
            },
        },
        {
            field: 'jobType',
            headerName: 'Job Type',
            width: 200,
        },
        {
            field: 'skillType',
            headerName: 'Skill type',
            width: 120,
        },

        {
            field: 'availability',
            headerName: 'Availability',
            width: 200,
        },

        {
            field: 'updatedAt',
            headerName: 'Updated At',
            width: 200,
            renderCell: (params) => {
                return new Date(params?.row?.updatedAt).toLocaleString()
            },
        },
    ]

    const [sp, setSp] = useSearchParams()

    return (
        <DashboardLayout>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="h4" fontWeight={600}>
                    Manage Job Cards
                </Typography>
                <LoadingButton
                    loading={isDownloading}
                    disabled={sp.toString().length === 0}
                    loadingPosition="start"
                    type="download"
                    startIcon={<Download />}
                    color="primary"
                    variant="outlined"
                    onClick={downloadJcaWithFilters}
                >
                    DOWNLOAD
                </LoadingButton>
            </Stack>
            <Paper sx={{ p: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <QueryMultiSelect sx={{ width: 300 }} name="jobCardStates" options={JobCardStates} />
                        </Grid>
                        <Grid item>
                            <QueryField
                                variant="outlined"
                                label="Worker Phone"
                                placeholder="Enter Phone Number"
                                validation={(val) => val.length <= 10 && !isNaN(Number(val))}
                                name="workerPhone"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                                error={sp.get('workerPhone') && sp.get('workerPhone').length < 10}
                            />
                        </Grid>
                        <Grid item>
                            <QueryField
                                variant="outlined"
                                label="Booking Id"
                                placeholder="Enter Booking ID"
                                name="bookingId"
                            />
                        </Grid>

                        <Grid item display="flex">
                            <DesktopDatePicker
                                disableFuture
                                label="CreatedAt Start Date"
                                inputFormat="dd/MM/yy"
                                mask="__/__/__"
                                value={sp.get('createdAtStartDate') ? new Date(sp.get('createdAtStartDate')) : null}
                                onChange={async (date) => {
                                    const nsp = new URLSearchParams(sp)
                                    nsp.set('createdAtStartDate', date.toISOString())
                                    nsp.delete('pageNumber')

                                    setSp(nsp, {
                                        replace: true,
                                    })
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item display="flex">
                            <DesktopDatePicker
                                disableFuture
                                label="CreatedAt end Date"
                                inputFormat="dd/MM/yy"
                                minDate={sp.get('createdAtStartDate') ? new Date(sp.get('createdAtStartDate')) : null}
                                mask="__/__/__"
                                value={sp.get('createdAtEndDate') ? new Date(sp.get('createdAtEndDate')) : null}
                                onChange={async (date) => {
                                    const nsp = new URLSearchParams(sp)
                                    nsp.set('createdAtEndDate', date.toISOString())
                                    nsp.delete('pageNumber')

                                    setSp(nsp, {
                                        replace: true,
                                    })
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item display="flex">
                            <Button variant="contained" onClick={() => getJobCards(sp)}>
                                Search
                            </Button>
                        </Grid>
                        <Grid item display="flex">
                            <QueryReset>Clear Filters</QueryReset>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Paper>

            <Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
                <DataGrid
                    disableColumnFilter
                    disableSelectionOnClick
                    disableColumnSelector
                    getRowHeight={(params) => {
                        if (params?.model?.cancellationDetails || params?.model?.completionDetails) {
                            return 100
                        } else {
                            return 56
                        }
                    }}
                    rows={jobCards}
                    rowCount={'fit-content'}
                    columns={columns}
                    pageSize={100}
                    paginationMode="server"
                    components={{
                        LoadingOverlay: LinearProgress,

                        Pagination: () => (
                            <>
                                <Stack direction="row" alignItems="center">
                                    Job Cards: {jobCards.length}
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
