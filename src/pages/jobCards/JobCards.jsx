import { MoreVert } from '@mui/icons-material'
import {
    Box,
    Button,
    Checkbox,
    Chip,
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
import { CTAMapByBookingType } from '../../utils/ctaHelpers'
import AddWorkerDialog from '../jobCards/AddWorkerDialog'
import { CancelJobCardConfirmationDialog } from './CancelJobCardCOnfirmationDialoag'
import EmploymentCompleteDialog from './EmploymentCompleteDialog'
import { useJobCards } from './hooks/useJobCards'
import UpdateHiringStatusDialog from '../../components/UpdateHiringStatusDialog'
import { capitalize } from '../../utils/stringHelpers'

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
        updateWorkerHiringStatus,
    } = useJobCards()

    const [addHeroModalProps, setAddHeroModalProps] = useState({ open: false })
    const [employmentCompleteDialogProps, setEmploymentCompleteDialog] = useState()
    const allowedTabs = useMemo(
        () => CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.tabs,
        [booking]
    )

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

    const [updateWorkerHiringStatusDialogProps, setUpdateWorkerHiringStatusProps] = useState({
        open: false,
        cancel: () => {},
        status: 'none',
        confirm: (status) => {},
    })
    const closeDialog = useCallback(() => {
        setConfirmDialogProps({})
        setUpdateWorkerHiringStatusProps({
            open: false,
            cancel: () => {},
            status: 'none',
            confirm: (status) => {},
        })
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
                field: 'hiringStatus',
                headerName: 'Hiring Status',
                sortable: true,
                width: 250,
                valueGetter: (params) =>
                    capitalize((params?.row?.jobCard?.status?.code ?? '')?.toLowerCase()?.split('_')?.join(' ')),
            },
            {
                field: 'wagePerDay',
                headerName: 'Wage Per Day',
                sortable: true,
                width: 150,
                valueGetter: (params) => params?.row?.jobCard?.wagePerDay,
            },

            {
                field: 'createdAt',
                headerName: 'Created At',
                sortable: true,
                width: 250,
                valueGetter: (params) => new Date(params?.row?.jobCard?.createdAt).toLocaleString(),
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
                            <Stack direction={'row'} gap={1}>
                                {allowedTabs[sp.get('jobCardStates')]?.jobCardActions?.cancel && (
                                    <Button
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setUpdateWorkerHiringStatusProps({
                                                cancel: closeDialog,
                                                confirm: (status) => updateWorkerHiringStatus(workerCard, status),

                                                status: workerCard?.jobCard?.status?.code,
                                                open: true,
                                            })
                                        }}
                                    >
                                        Update Hiring Status
                                    </Button>
                                )}
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
                            </Stack>
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
        setSp(nsp, { replace: true })
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
            <UpdateHiringStatusDialog {...updateWorkerHiringStatusDialogProps} />
            <ConfirmationDialog {...confirmDialogProps} />
            <EmploymentCompleteDialog {...employmentCompleteDialogProps} />
            <ConfirmationDialog {...confirmationDialogProps} />
            {booking && setReload && (
                <AddWorkerDialog
                    open={addHeroModalProps.open}
                    state={addHeroModalProps.state}
                    setOpen={setAddHeroModalProps}
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
                                {CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.tabs[
                                    sp.get('jobCardStates')
                                ]?.addWorkerAsApplied &&
                                    !bulkSelectionOn && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setAddHeroModalProps({
                                                    open: !addHeroModalProps.open,
                                                    state: 'WORKER_APPLIED',
                                                })
                                            }}
                                        >
                                            Add Hero Applied
                                        </Button>
                                    )}
                                {CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.tabs[
                                    sp.get('jobCardStates')
                                ]?.addWorker &&
                                    !bulkSelectionOn && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setAddHeroModalProps({
                                                    open: !addHeroModalProps.open,
                                                    state: 'READY_TO_DEPLOY',
                                                })
                                            }}
                                        >
                                            Add Hero RTD
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
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
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
                                        label={
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Stack>{`${tab?.label} (${tab?.count})`}</Stack>
                                                {booking?.jobIds[tab.value] && (
                                                    <Chip color="primary" size="small" label={'Live'} />
                                                )}
                                            </Stack>
                                        }
                                        value={tab?.value}
                                    />
                                )
                            })}
                            <Stack direction={'row'} spacing={2} ml="auto" mr={3} alignItems="center">
                                {CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.tabs[
                                    sp.get('jobCardStates')
                                ]?.filters?.pdrc && (
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
                                            setSp(nsp, { replace: true })
                                        }}
                                        control={<Checkbox />}
                                        label="PDRC"
                                    />
                                )}
                                {CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.tabs[
                                    sp.get('jobCardStates')
                                ]?.filters?.drc && (
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
                                            setSp(nsp, { replace: true })
                                        }}
                                        control={<Checkbox />}
                                        label="DRC"
                                    />
                                )}
                                {
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={sp.get('workerPhone') ? '1' : undefined}
                                        onClick={() => {
                                            sp.delete('workerPhone')
                                            setSp(sp)
                                        }}
                                    >
                                        clear Filters
                                    </Button>
                                }
                                {/* {
                                    <Button variant="contained" startIcon={1} size="small">
                                        Filters
                                    </Button>
                                } */}
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
                    <Stack justifyContent={'center'} direction="row" my={10}>
                        <Typography variant="h4" color="grey.A400">
                            Allocation has not started yet
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </>
    )
}

export default JobCards
