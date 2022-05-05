import {
    Box,
    Button,
    Chip,
    Dialog,
    InputAdornment,
    LinearProgress,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../api'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { checkError } from '../../utils/formikValidate'
import AddPartners from './AddPartners/AddPartners'
// import {AddPartners} from './AddPartners'

const Partner = () => {
    const { showSnackbar } = useSnackbar()
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [open, setOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const form = useFormik({
        initialValues: {
            name: '',
            phoneNumber: '',
        },
        validate: (values) => {
            const errors = {}
            if (Number.isNaN(Number(values.phoneNumber))) {
                errors.phoneNumber = 'Enter Valid phone Number'
            }

            return errors
        },
        onSubmit: (values, formHelpers) => {
            const serachP = new URLSearchParams()
            values.phoneNumber ? serachP.set('phoneNumber', values.phoneNumber) : searchParams.delete('phoneNumber')
            values.name !== '' ? serachP.set('name', values.name) : searchParams.delete('name')
            serachP.delete('pageNumber')

            setSearchParams(serachP, {
                replace: true,
            })
        },
    })
    const load = async () => {
        setIsLoading(true)
        try {
            searchParams.set('pageSize', 100)
            searchParams.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)

            const response = await axios.get(`${getBackendUrl()}/admin/partners?${searchParams}`)

            if (response.status === 200) {
                setData([...response.data.payload.partnerCards])
                setHasMore(response.data.payload.hasMore)
            }
        } catch (error) {
            setSnackBar({
                msg: 'failed to fetch workers',
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        load()
    }, [searchParams])

    useEffect(() => {
        if (searchParams.get('phoneNumber') || searchParams.get('name')) {
            form.setValues({
                phoneNumber: searchParams.get('phoneNumber') || '',
                name: searchParams.get('name') || '',
            })
        }
    }, [searchParams])

    const handleClose = () => {
        setOpen(false)
    }
    const columns = [
        {
            field: 'userName',
            headerName: <h4>Name</h4>,
            width: 450,
        },
        {
            field: 'phoneNumber',
            headerName: <h4>Phone Number</h4>,
            width: 500,
        },
        {
            field: 'referralCode',
            headerName: <h4>Referral Code</h4>,
            renderCell: (params) => (
                <Chip
                    sx={{
                        width: 120,
                    }}
                    color="primary"
                    label={params?.row?.referralCode}
                    onClick={() => {
                        navigator.clipboard.writeText(params?.row?.referralCode).then(() => {
                            showSnackbar({
                                msg: `Referral code Copied successfully: ${params?.row?.referralCode}`,
                                sev: 'success',
                            })
                        })
                    }}
                />
            ),
            width: 500,
        },
    ]

    return (
        <>
            <DashboardLayout>
                <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                    <Typography variant="h4" fontWeight={600} align="center">
                        Manage Partner
                    </Typography>
                    <Button
                        sx={{
                            mb: 2,
                            height: 48,
                        }}
                        variant="outlined"
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        Add Partner
                    </Button>
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
                            <TextField
                                variant="outlined"
                                label="Partner Name"
                                name="name"
                                value={form.values.name}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                error={!!checkError('name', form)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                placeholder="Partner Name"
                            />
                            <TextField
                                variant="outlined"
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                value={form.values.phoneNumber}
                                onChange={(e) => {
                                    if (e.target.value.length <= 10 && !Number.isNaN(Number(e.target.value))) {
                                        form.handleChange(e)
                                    }
                                }}
                                onBlur={form.handleBlur}
                                error={!!checkError('phoneNumber', form)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                            />
                            <Button variant="contained" type="submit">
                                Search
                            </Button>
                        </Stack>

                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <AddPartners open={open} setOpen={setOpen} />
                        </Dialog>
                    </form>
                </Paper>
                <Paper sx={{ mt: 2, height: '74vh', width: '100%', p: 2 }}>
                    <DataGrid
                        disableColumnFilter
                        disableSelectionOnClick
                        disableColumnSelector
                        rows={data.map((val) => ({ ...val, id: val.partnerId }))}
                        columns={columns}
                        components={{
                            LoadingOverlay: LinearProgress,
                            Pagination: () => (
                                <Stack direction="row" alignItems="center">
                                    Partners: {data.length}
                                    <Pagination
                                        page={
                                            searchParams.get('pageNumber') ? Number(searchParams.get('pageNumber')) : 1
                                        }
                                        hideNextButton={!hasMore}
                                        count={hasMore ? 35 : Number(searchParams.get('pageNumber'))}
                                        siblingCount={0}
                                        disabled={isLoading}
                                        boundaryCount={0}
                                        showFirstButton={false}
                                        showLastButton={false}
                                        color="primary"
                                        onChange={(e, page) => {
                                            searchParams.set('pageNumber', page)
                                            setSearchParams(searchParams)
                                            document.querySelector('.MuiDataGrid-virtualScroller').scrollTop = 0
                                        }}
                                    />
                                </Stack>
                            ),
                        }}
                        loading={isLoading}
                    />
                </Paper>
            </DashboardLayout>
        </>
    )
}

export default Partner
