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
import React, { useEffect, useMemo, useState } from 'react'
import { PopAlert } from '../../components/Snackbar'
import { CTAMap } from '../../utils/ctaHelpers'
import AddWorkerDialog from '../jobCards/AddWorkerDialog'
import EmploymentCompleteDialog from './EmploymentCompleteDialog'
import { useJobCards } from './hooks/useJobCards'

const JobCards = (booking) => {
	const {
		bookingSummary,
		skillTypeSummary,
		selectedTab,
		handelTabChange,
		cancelWorkerJobCard,
		markWorkerJobCardAsRTD,
		deployWorkerJobCard,
		markJobCardAsAccepted,
		employmentCompleteForWorker,
		setReload,
	} = useJobCards()
	useEffect(() => {
		setReload(true)
	}, [booking])

	const [open, setOpen] = useState(false)
	const [employmentCompleteDialogProps, setEmploymentCompleteDialog] = useState()
	// const allowedActions = useMemo(() => CTAMap[bookingSummary.status.enumValue]?.actions, [bookingSummary])
	const allowedTabs = CTAMap[bookingSummary?.status?.enumValue]?.tabs
	return (
		<>
			<EmploymentCompleteDialog {...employmentCompleteDialogProps} />
			{bookingSummary && setReload && (
				<AddWorkerDialog
					open={open}
					setOpen={setOpen}
					setReload={setReload}
					jobIdForSkillType={bookingSummary?.jobIds}
				/>
			)}

			<Paper>
				{allowedTabs ? (
					<TabContext value={selectedTab}>
						<Tabs value={selectedTab} indicatorColor="primary" textColor="primary" onChange={handelTabChange}>
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
						{CTAMap[bookingSummary?.status.enumValue]?.tabs[selectedTab].addWorker && (
							<Stack direction="row" justifyContent="flex-end">
								<Button
									sx={{ m: 1 }}
									size="large"
									variant="outlined"
									onClick={() => {
										setOpen(!open)
									}}>
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
														}}>
														<TableCell>Name</TableCell>
														<TableCell>Phone Number</TableCell>
														<TableCell>City</TableCell>
														<TableCell align="center"></TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{workerCards.map((workerCard) => (
														<TableRow key={workerCard.jobCardId}>
															<TableCell>{workerCard.name}</TableCell>
															<TableCell>{workerCard.phoneNumber}</TableCell>
															<TableCell>{workerCard.city}</TableCell>
															<TableCell align="right">
																{allowedTabs && (
																	<Box>
																		{allowedTabs[selectedTab]?.jobCardActions?.cancel && (
																			<Button
																				sx={{
																					m: 1,
																				}}
																				onClick={() => cancelWorkerJobCard(workerCard)}
																				variant="outlined">
																				Cancel
																			</Button>
																		)}
																		{allowedTabs[selectedTab]?.jobCardActions?.accept && (
																			<Button
																				sx={{
																					m: 1,
																				}}
																				onClick={() => markJobCardAsAccepted(workerCard)}
																				variant="outlined">
																				Move To Accepted
																			</Button>
																		)}
																		{allowedTabs[selectedTab]?.jobCardActions?.rtd && (
																			<Button
																				sx={{
																					m: 1,
																				}}
																				onClick={() => markWorkerJobCardAsRTD(workerCard)}
																				variant="outlined">
																				Move To RTD
																			</Button>
																		)}
																		{allowedTabs[selectedTab]?.jobCardActions?.deploy && (
																			<Button
																				sx={{
																					m: 1,
																				}}
																				onClick={() => {
																					deployWorkerJobCard(workerCard)
																				}}
																				variant="outlined">
																				Move to Deployed
																			</Button>
																		)}
																		{allowedTabs[selectedTab]?.jobCardActions?.employmentComplete &&
																			bookingSummary?.generateEarnings && (
																				<Button
																					sx={{
																						m: 1,
																					}}
																					onClick={() => {
																						setEmploymentCompleteDialog({
																							open: true,
																							setOpen: setEmploymentCompleteDialog,
																							workerCard: workerCard,
																							confirm: employmentCompleteForWorker,
																						})
																					}}
																					variant="outlined">
																					Employment Complete
																				</Button>
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
		</>
	)
}

export default JobCards
