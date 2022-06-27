import { MoreVert } from '@mui/icons-material'
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { useBooking } from '../../providers/BookingProvider'
import { CTAMap } from '../../utils/ctaHelpers'
import AddWorkerDialog from '../jobCards/AddWorkerDialog'
import { CancelJobCardConfirmationDialog } from './CancelJobCardCOnfirmationDialoag'
import EmploymentCompleteDialog from './EmploymentCompleteDialog'
import { useJobCards } from './hooks/useJobCards'

const JobCards = () => {
    const { booking, project, stats } = useBooking()
    const {
        cancelWorkerJobCard,
        markWorkerJobCardAsRTD,
        deployWorkerJobCard,
        markJobCardAsAccepted,
        setReload,
        bulkCancelWorkerJobCard,
        setBulkSelectionOn,
        markDRCDoneForJobCard,
        markPDRCDoneForJobCard,
        bulkSelectionOn,
        setBulkOperationList,
        hasMore,
        jobCards,
        reload,
    } = useJobCards()

    const [open, setOpen] = useState(false)
    const [employmentCompleteDialogProps, setEmploymentCompleteDialog] = useState()
    const allowedTabs = useMemo(() => CTAMap[booking?.status]?.tabs, [booking])

    const [confirmDialogProps, setConfirmDialogProps] = useState({
        content: '',
        open: false,
        cancel: () => {},
        confirm: () => {},
    })
    const [cancelJobCardConfirmationDialogProps, setCancelJobCardConfirmationDialogProps] = useState({
        open: false,
        cancel: () => {},
        confirm: () => {},
        reset: false,
        jobCardState: undefined,
        bookingState: undefined,
    })
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({})

    const closeDialog = useCallback(() => {
        setConfirmDialogProps({})
        setCancelJobCardConfirmationDialogProps({ open: false })
    }, [])
    const [sp, setSp] = useSearchParams()

    const columns = useMemo(
        () => [
            {
                field: 'name',
                headerName: 'Name',
                sortable: true,
                width: 180,
                valueGetter: (params) => params?.row?.worker?.name,
            },
            {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                sortable: true,
                width: 150,
                valueGetter: (params) => params?.row?.worker?.phoneNumber,
            },
            {
                field: 'city',
                headerName: 'City',
                sortable: true,
                width: 150,
                valueGetter: (params) => params?.row?.worker?.city,
            },
            {
                field: 'availability',
                headerName: 'Availability',
                sortable: true,
                width: 250,
                valueGetter: (params) => params?.row?.jobCard?.availability,
            },

            {
                field: 'createdAt',
                headerName: 'Created At',
                sortable: true,
                width: 250,
                valueGetter: (params) => params?.row?.jobCard?.createdAt,
            },
            {
                field: 'isPDRCDone',
                headerName: 'PDRC',
                sortable: true,
                width: 120,
                hide: sp.get('jobCardStates') !== 'READY_TO_DEPLOY',
                valueGetter: (params) => (params?.row?.jobCard?.isPDRCDone ? 'Yes' : 'No'),
            },
            {
                field: 'isDRCDone',
                headerName: 'DRC',
                sortable: true,
                width: 120,
                hide: sp.get('jobCardStates') !== 'READY_TO_DEPLOY',
                valueGetter: (params) => (params?.row?.jobCard?.isDRCDone ? 'Yes' : 'No'),
            },

            {
                flex: 1,
                field: 'Actions',
                headerName: 'Actions',
                renderCell: ({ row: workerCard }) => (
                    <>
                        {allowedTabs && !bulkSelectionOn && (
                            <Box>
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.cancel && (
                                    <Button
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setCancelJobCardConfirmationDialogProps({
                                                reset: false,
                                                open: true,
                                                content: (
                                                    <>
                                                        <strong>Remove Hero</strong>
                                                        &nbsp;from this booking?
                                                    </>
                                                ),
                                                cancel: closeDialog,
                                                confirm: (churnType, churnReason, other) => {
                                                    cancelWorkerJobCard(workerCard, churnType, churnReason, other)
                                                    closeDialog()
                                                },
                                                jobCardState: sp.get('jobCardStates'),
                                                bookingState: booking?.status,
                                            })
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.accept && (
                                    <Button
                                        sx={{
                                            m: 1,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            markJobCardAsAccepted(workerCard)
                                        }}
                                        variant="outlined"
                                    >
                                        Move To Accepted
                                    </Button>
                                )}
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.rtd && (
                                    <Button
                                        sx={{
                                            m: 1,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            markWorkerJobCardAsRTD(workerCard)
                                        }}
                                        variant="outlined"
                                    >
                                        Move To RTD
                                    </Button>
                                )}
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.deploy &&
                                    !workerCard?.jobCard?.isPDRCDone && (
                                        <Button
                                            sx={{
                                                m: 1,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                markPDRCDoneForJobCard(workerCard)
                                            }}
                                            variant="outlined"
                                        >
                                            Mark PDRC Done
                                        </Button>
                                    )}

                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.deploy &&
                                    workerCard?.jobCard?.isPDRCDone &&
                                    !workerCard?.jobCard?.isDRCDone && (
                                        <Button
                                            sx={{
                                                m: 1,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                markDRCDoneForJobCard(workerCard)
                                            }}
                                            variant="outlined"
                                        >
                                            Mark DRC Done
                                        </Button>
                                    )}
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.deploy &&
                                    workerCard?.jobCard?.isPDRCDone &&
                                    workerCard?.jobCard?.isDRCDone && (
                                        <Button
                                            sx={{
                                                m: 1,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deployWorkerJobCard(workerCard)
                                            }}
                                            variant="outlined"
                                        >
                                            Move to Deployed
                                        </Button>
                                    )}
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.manageEmployee && (
                                    <Link
                                        to={`/projects/${
                                            project?._id
                                        }?tab=employee&phoneNumber=${workerCard?.worker?.phoneNumber.replace(
                                            '+91',
                                            ''
                                        )}`}
                                    >
                                        <Button variant="outlined">Manage Employee</Button>
                                    </Link>
                                )}
                            </Box>
                        )}
                    </>
                ),
                minWidth: 500,
            },
        ],
        [
            allowedTabs,
            deployWorkerJobCard,
            markWorkerJobCardAsRTD,
            markJobCardAsAccepted,
            cancelWorkerJobCard,
            closeDialog,
            markDRCDoneForJobCard,
            markPDRCDoneForJobCard,
            booking,
            sp,
            bulkSelectionOn,
        ]
    )
    const [menuAnchor, setMenuAnchor] = useState()
    useEffect(() => {
        if (!allowedTabs) return
        if (Object.keys(allowedTabs).includes(sp.get('jobCardStates')) && sp.get('skillTypes')) return
        const nsp = new URLSearchParams(sp)
        nsp.set('jobCardStates', Object.keys(allowedTabs)[0])
        nsp.set('skillTypes', 'HELPER')
        setSp(nsp)
    }, [booking, allowedTabs])

    const skillTypeTab = useMemo(() => {
        const obj = {
            HELPER: 0,
            TECHNICIAN: 0,
            SUPERVISOR: 0,
            ...stats?.jobCardCounts[sp.get('jobCardStates')],
        }
        return Object.keys(obj)?.map((tab) => ({ label: tab, value: tab, count: obj[tab] }))
    }, [stats, sp, booking])
    return (
        <>
            <ConfirmationDialog {...confirmDialogProps} />
            <EmploymentCompleteDialog {...employmentCompleteDialogProps} />
            <ConfirmationDialog {...confirmationDialogProps} />
            {booking && setReload && (
                <AddWorkerDialog
                    open={open}
                    setOpen={setOpen}
                    setReload={setReload}
                    jobIdForSkillType={booking?.jobIds}
                />
            )}
            <CancelJobCardConfirmationDialog {...cancelJobCardConfirmationDialogProps} />

            <Stack>
                {allowedTabs ? (
                    <Stack>
                        <Tabs
                            TabIndicatorProps={{
                                hidden: true,
                            }}
                            value={sp.get('jobCardStates') ?? Object.keys(allowedTabs)[0]}
                            indicatorColor="primary"
                            onChange={(e, v) => {
                                sp.set('jobCardStates', v)
                                sp.delete('pageNumber')
                                sp.delete('isPDRCDone')
                                sp.delete('isDRCDone')

                                setSp(sp, { replace: true })
                                setCancelJobCardConfirmationDialogProps((prev) => ({ ...prev, reset: true }))
                            }}
                        >
                            {Object.keys(allowedTabs).map((tab) => {
                                const count =
                                    stats?.jobCardCounts[tab] &&
                                    Object.values(stats?.jobCardCounts[tab]).reduce((p, n) => p + n)
                                return (
                                    <Tab
                                        key={tab}
                                        sx={{
                                            backgroundColor: tab === sp.get('jobCardStates') ? 'primary.main' : '',
                                            color: tab === sp.get('jobCardStates') ? '#ffffff !important' : '',
                                            borderRadius: '8px 8px 0 0',
                                        }}
                                        label={`${tab} (${count ?? 0})`}
                                        value={tab}
                                    />
                                )
                            })}
                            <Stack direction="row" justifyContent="flex-end" spacing={2} ml="auto" alignItems="center">
                                {CTAMap[booking?.status]?.tabs[sp.get('jobCardStates')]?.addWorker && !bulkSelectionOn && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setOpen(!open)
                                        }}
                                    >
                                        Add Hero
                                    </Button>
                                )}
                                <>
                                    {bulkSelectionOn ? (
                                        <>
                                            <Button variant="outlined" onClick={(e) => setBulkSelectionOn(false)}>
                                                Stop Bulk Select
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="contained"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setCancelJobCardConfirmationDialogProps({
                                                        reset: false,
                                                        open: true,
                                                        content: (
                                                            <>
                                                                <strong>Remove Hero</strong>
                                                                &nbsp;from this booking?
                                                            </>
                                                        ),
                                                        cancel: closeDialog,
                                                        confirm: (churnType, churnReason, other) => {
                                                            bulkCancelWorkerJobCard(churnType, churnReason, other)
                                                            closeDialog()
                                                            setBulkSelectionOn(false)
                                                        },
                                                        jobCardState: sp.get('jobCardStates'),
                                                        bookingState: booking?.status,
                                                    })
                                                }}
                                            >
                                                Cancel Selected Job Cards
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton
                                                id="long-button"
                                                onClick={(e) => setMenuAnchor(e.currentTarget)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                anchorEl={menuAnchor}
                                                open={!!menuAnchor}
                                                onClose={(e) => setMenuAnchor(undefined)}
                                            >
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setBulkSelectionOn(true)
                                                        setMenuAnchor(undefined)
                                                    }}
                                                >
                                                    Bulk Select
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </>
                            </Stack>
                        </Tabs>
                        <Tabs
                            value={sp.get('skillTypes') ?? 'HELPER'}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(e, v) => {
                                sp.set('skillTypes', v)
                                sp.delete('pageNumber')
                                setSp(sp)
                                setCancelJobCardConfirmationDialogProps((prev) => ({ ...prev, reset: true }))
                            }}
                        >
                            {' '}
                            {skillTypeTab?.map((tab) => {
                                return (
                                    <Tab
                                        key={tab.value}
                                        sx={{ alignItems: 'flex-end' }}
                                        label={`${tab?.label} (${tab?.count})`}
                                        value={tab?.value}
                                    />
                                )
                            })}
                            <Stack direction={'row'} spacing={2} ml="auto" mr={3}>
                                {CTAMap[booking?.status]?.tabs[sp.get('jobCardStates')]?.filters?.pdrc && (
                                    <FormControlLabel
                                        checked={sp.get('isPDRCDone') === 'true'}
                                        onChange={(e, checked) => {
                                            e.stopPropagation()
                                            const nsp = new URLSearchParams(sp)
                                            if (checked) {
                                                nsp.set('isPDRCDone', true)
                                            } else {
                                                nsp.delete('isPDRCDone')
                                            }
                                            setSp(nsp)
                                        }}
                                        control={<Checkbox />}
                                        label="PDRC"
                                    />
                                )}
                                {CTAMap[booking?.status]?.tabs[sp.get('jobCardStates')]?.filters?.drc && (
                                    <FormControlLabel
                                        checked={sp.get('isDRCDone') === 'true'}
                                        onChange={(e, checked) => {
                                            e.stopPropagation()
                                            const nsp = new URLSearchParams(sp)
                                            if (checked) {
                                                nsp.set('isDRCDone', true)
                                            } else {
                                                nsp.delete('isDRCDone')
                                            }
                                            setSp(nsp)
                                        }}
                                        control={<Checkbox />}
                                        label="DRC"
                                    />
                                )}
                            </Stack>
                        </Tabs>
                        <DataGrid
                            sx={{ minHeight: 'calc(100vh - 400px)' }}
                            disableColumnMenu
                            disableColumnFilter
                            disableSelectionOnClick
                            disableColumnSelector
                            checkboxSelection={bulkSelectionOn}
                            columns={columns}
                            onSelectionModelChange={(selectedJobCardIds) => setBulkOperationList(selectedJobCardIds)}
                            rows={jobCards ?? []}
                            loading={reload}
                            getRowId={(row) => row?.jobCard?.jobCardId}
                            components={{
                                Pagination: () => (
                                    <>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Typography> Job Cards: {jobCards.length}</Typography>
                                            <Pagination
                                                page={sp.get('pageNumber') ? Number(sp.get('pageNumber')) : 1}
                                                hidePrevButton={
                                                    !Number(sp.get('pageNumber')) || Number(sp.get('pageNumber')) === 1
                                                }
                                                hideNextButton={!hasMore}
                                                count={hasMore ? 10000 : Number(sp.get('pageNumber'))}
                                                siblingCount={0}
                                                disabled={reload}
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
                    </Stack>
                ) : (
                    <CircularProgress />
                )}
            </Stack>
        </>
    )
}

export default JobCards
