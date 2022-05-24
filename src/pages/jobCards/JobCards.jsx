import { TabContext } from '@material-ui/lab'
import {
    Box,
    Button,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { useBooking } from '../../providers/BookingProvider'
import { CTAMap } from '../../utils/ctaHelpers'
import { capitalize } from '../../utils/stringHelpers'
import AddWorkerDialog from '../jobCards/AddWorkerDialog'
import { CancelJobCardConfirmationDialog } from './CancelJobCardCOnfirmationDialoag'
import EmploymentCompleteDialog from './EmploymentCompleteDialog'
import { useJobCards } from './hooks/useJobCards'

const JobCards = () => {
    const { booking, project } = useBooking()
    const {
        bookingSummary,
        skillTypeSummary,
        selectedTab,
        handelTabChange,
        cancelWorkerJobCard,
        markWorkerJobCardAsRTD,
        deployWorkerJobCard,
        markJobCardAsAccepted,
        setReload,
    } = useJobCards()

    useEffect(() => {
        setReload(true)
    }, [booking])
    const [open, setOpen] = useState(false)
    const [employmentCompleteDialogProps, setEmploymentCompleteDialog] = useState()
    const allowedTabs = useMemo(() => CTAMap[bookingSummary?.status?.enumValue]?.tabs, [bookingSummary])

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
        jobCardState: undefined,
        bookingState: undefined,
    })
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({})

    const closeDialog = useCallback(() => {
        setConfirmDialogProps({})
        setCancelJobCardConfirmationDialogProps({ open: false })
    }, [])

    return (
        <>
            <EmploymentCompleteDialog {...employmentCompleteDialogProps} />
            <ConfirmationDialog {...confirmationDialogProps} />
            {bookingSummary && setReload && (
                <AddWorkerDialog
                    open={open}
                    setOpen={setOpen}
                    setReload={setReload}
                    jobIdForSkillType={booking?.jobIds}
                />
            )}
            <CancelJobCardConfirmationDialog {...cancelJobCardConfirmationDialogProps} />

            <Paper>
                {allowedTabs ? (
                    <TabContext value={selectedTab}>
                        <Tabs
                            value={selectedTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handelTabChange}
                        >
                            {Object.keys(allowedTabs).map((tab) => {
                                const [state] = bookingSummary.jobCardsStateCount.filter((obj) => obj.enumValue === tab)
                                return (
                                    <Tab
                                        key={state?.enumValue}
                                        label={`${state?.enumLabel} (${state?.count})`}
                                        value={state?.enumValue}
                                    />
                                )
                            })}
                        </Tabs>
                        {CTAMap[bookingSummary?.status.enumValue]?.tabs[selectedTab]?.addWorker && (
                            <Stack direction="row" justifyContent="flex-end">
                                <Button
                                    sx={{ m: 1 }}
                                    size="large"
                                    variant="outlined"
                                    onClick={() => {
                                        setOpen(!open)
                                    }}
                                >
                                    Add Hero
                                </Button>
                            </Stack>
                        )}
                        {skillTypeSummary &&
                            Object.keys(skillTypeSummary)?.map((skillType) => {
                                const workerCards = skillTypeSummary[skillType].workerCards
                                return (
                                    <Box p={2} key={skillType}>
                                        <Typography style={{ marginBottom: '20px' }} variant="h5">
                                            {skillType} ({workerCards.length})
                                        </Typography>

                                        <TableContainer component={Paper} variant="outlined">
                                            <Table>
                                                <TableHead>
                                                    <TableRow
                                                        sx={{
                                                            '*': {
                                                                fontWeight: '900 !important',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Phone Number</TableCell>
                                                        <TableCell>City</TableCell>
                                                        <TableCell>Availability</TableCell>
                                                        <TableCell>Created At</TableCell>
                                                        <TableCell align="center"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {workerCards.map((workerCard) => (
                                                        <TableRow key={workerCard.jobCardId}>
                                                            <TableCell>{workerCard.name}</TableCell>
                                                            <TableCell>{workerCard.phoneNumber}</TableCell>
                                                            <TableCell>{workerCard.city}</TableCell>
                                                            <TableCell>
                                                                {workerCard.availability
                                                                    ? capitalize(
                                                                          workerCard.availability
                                                                              .split('_')
                                                                              .join(' ')
                                                                              .toLowerCase()
                                                                      )
                                                                    : ''}
                                                            </TableCell>
                                                            <TableCell>
                                                                {workerCard.createdAt ? workerCard.createdAt : ''}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {allowedTabs && (
                                                                    <Box>
                                                                        {allowedTabs[selectedTab]?.jobCardActions
                                                                            ?.cancel && (
                                                                            <Button
                                                                                variant="outlined"
                                                                                onClick={() => {
                                                                                    setCancelJobCardConfirmationDialogProps(
                                                                                        {
                                                                                            open: true,
                                                                                            content: (
                                                                                                <>
                                                                                                    <strong>
                                                                                                        Remove Hero
                                                                                                    </strong>
                                                                                                    &nbsp;from this
                                                                                                    booking?
                                                                                                </>
                                                                                            ),
                                                                                            cancel: closeDialog,
                                                                                            confirm: (
                                                                                                churnType,
                                                                                                churnReason,
                                                                                                other
                                                                                            ) => {
                                                                                                cancelWorkerJobCard(
                                                                                                    workerCard,
                                                                                                    churnType,
                                                                                                    churnReason,
                                                                                                    other
                                                                                                )
                                                                                                closeDialog()
                                                                                            },
                                                                                            jobCardState: selectedTab,
                                                                                            bookingState:
                                                                                                bookingSummary.status
                                                                                                    .enumValue,
                                                                                        }
                                                                                    )
                                                                                }}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        )}
                                                                        {allowedTabs[selectedTab]?.jobCardActions
                                                                            ?.accept && (
                                                                            <Button
                                                                                sx={{
                                                                                    m: 1,
                                                                                }}
                                                                                onClick={() =>
                                                                                    markJobCardAsAccepted(workerCard)
                                                                                }
                                                                                variant="outlined"
                                                                            >
                                                                                Move To Accepted
                                                                            </Button>
                                                                        )}
                                                                        {allowedTabs[selectedTab]?.jobCardActions
                                                                            ?.rtd && (
                                                                            <Button
                                                                                sx={{
                                                                                    m: 1,
                                                                                }}
                                                                                onClick={() =>
                                                                                    markWorkerJobCardAsRTD(workerCard)
                                                                                }
                                                                                variant="outlined"
                                                                            >
                                                                                Move To RTD
                                                                            </Button>
                                                                        )}
                                                                        {allowedTabs[selectedTab]?.jobCardActions
                                                                            ?.deploy && (
                                                                            <Button
                                                                                sx={{
                                                                                    m: 1,
                                                                                }}
                                                                                onClick={() => {
                                                                                    deployWorkerJobCard(workerCard)
                                                                                }}
                                                                                variant="outlined"
                                                                            >
                                                                                Move to Deployed
                                                                            </Button>
                                                                        )}
                                                                        {allowedTabs[selectedTab]?.jobCardActions
                                                                            ?.manageEmployee && (
                                                                            <Link
                                                                                to={`/projects/${
                                                                                    project?._id
                                                                                }?tab=employee&phoneNumber=${workerCard?.phoneNumber.replace(
                                                                                    '+91',
                                                                                    ''
                                                                                )}`}
                                                                            >
                                                                                <Button variant="outlined">
                                                                                    Manage Employee
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                    </Box>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                )
                            })}
                    </TabContext>
                ) : (
                    <Typography align="center" variant="h5" color="#aeaeae" m={30}>
                        Heroes allocation has not started yet
                    </Typography>
                )}
            </Paper>
            <ConfirmationDialog {...confirmDialogProps} />
        </>
    )
}

export default JobCards
