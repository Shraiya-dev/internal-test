import {
	Box,
	Button,
	Checkbox,
	Chip,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import { Autocomplete } from '@material-ui/lab'
import { format } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { FileInput } from '../../components/CustomInputs'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert } from '../../components/Snackbar'
import { BOOKING_STAGES } from '../../utils/bookingStates'
import { cities, states } from '../../utils/data'
import { getSelectOptions } from '../../utils/InputHelpers'
import useBookingAction from './hooks/useBookingAction'
import { useBookingDetailed } from './hooks/useBookingDetailed'
import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => ({
	formContainer: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	select: {
		flex: 0.49,
	},
	mr20: {
		marginRight: '20px',
	},
	mt20: {
		marginTop: '20px',
	},
	headingContainer: {
		padding: '32px 32px 0',
	},
	mainForm: {
		flex: 1,
	},
}))

const JobTypeOptions = [
	{ label: 'Select Job Type', value: 'none' },
	{ label: 'Carpenter', value: 'CARPENTER' },
	{ label: 'Bar Bender', value: 'BAR_BENDER' },
	{ label: 'General Helper', value: 'GENERAL_HELPER' },
	{ label: 'Aluminium Fabricator', value: 'ALUMINIUM_FABRICATOR' },
	{ label: 'Welder - Fitter', value: 'WELDER_FITTER' },
	{ label: 'Painter', value: 'PAINTER' },
	{ label: 'Mason', value: 'MASON' },
	{ label: 'Stone/Tile/Marble Layer', value: 'STONE_TILE_MARBLE_LAYER' },
	{ label: 'Electrical', value: 'ELECTRICAL' },
	{ label: 'Gypsum', value: 'GYPSUM' },
	{ label: 'HVAC', value: 'HVAC' },
	{ label: 'Plumbing', value: 'PLUMBING' },
	{ label: 'Shuttering Carpenter', value: 'SHUTTERING_CARPENTER' },
]

const shiftTimingOptions = [
	{ label: 'Select Shift Timing', value: 'none' },
	{ label: '9am-6pm', value: '9am-6pm' },
	{ label: '6pm-12am', value: '6pm-12am' },
	{ label: 'other', value: 'other' },
]

const tags = {
	CARPENTER: ['Modular Furniture', 'Wooden Doors & Windows', 'Solid Wood Furniture', 'Plywood Furniture'],
	BAR_BENDER: ['Manual Barbending', 'Barbending Machine Operator'],
	GENERAL_HELPER: ['Housekeeping', 'Loading/Offloading'],
	ALUMINIUM_FABRICATOR: ['Windows & Doors', 'Partition Works'],
	WELDER_FITTER: ['Structural Fabrication', 'Pre-Engineered Building Structures'],
	PAINTER: [
		'Internal Painting - Plain',
		'External Painting - High Rise',
		'Stucco Painting',
		'Internal Decorative/Texture Painting',
		'Polish & Varnish',
		'Metal Painting',
		'PU/Duco Painting',
	],
	MASON: [
		'Slab/Column Casting',
		'Concreting/Foundation - PCC/RCC/RMC',
		'External Plastering - High Rise',
		'AAC Blockwork',
		'Brickwork',
		'Plastering',
	],
	STONE_TILE_MARBLE_LAYER: [
		'Floor & Wall Tiling',
		'Granite & Stone Works',
		'Marble Laying',
		'Intricate Flooring/Wall Stone Works',
	],
	ELECTRICAL: [
		'Internal Wiring & Terminations',
		'High Side - Panel Erection & Commissioning',
		'Transformer & Switchgear',
		'Low Voltage Works',
	],
	GYPSUM: ['Drywall Partition', 'False Ceiling', 'Gypsum Punning', 'Decorative Gypsum Works'],
	HVAC: ['VRV Works', 'Duct Fabrication & Erection', 'DX Works', 'Ducting Insulation', 'AHU Erection & Commissioning'],
	PLUMBING: [
		'Internal Plumbing',
		'External Plumbing - High Rise',
		'Fixtures Installation',
		'Pumps Erection & Commissioning',
	],
	SHUTTERING_CARPENTER: [
		'Aluminium Formwork',
		'Steel Formwork',
		'Plywood Formwork',
		'Fabric Formwork',
		'Timber Formwork',
		'Plastic Formwork',
	],
}

export const bookingDurations = ['less than 7 days', '7 days to 45 days', '45 days to 90 days', 'more than 90 days']

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const overTimeBufferTypeOptions = [
	{ label: 'Minutes', value: 'minutes' },
	{ label: 'Hours', value: 'hours' },
]

const BookingDetailed = () => {
	const classes = useStyles()
	const { bookingId } = useParams()

	const {
		form,
		formDisabled,
		editForm,
		updateBooking,
		checkError,
		getBooking,
		sncBar,
		setSncBar,
		accomoImages,
		setAccomoImages,
		setSiteImages,
		siteImages,
		uploadImages,
		booking,
	} = useBookingDetailed(bookingId)
	const [confirmDialogProps, setConfirmDialogProps] = useState({
		content: '',
		open: false,
		cancel: () => {},
		confirm: () => {},
	})
	const closeDialog = useCallback(() => {
		setConfirmDialogProps({})
	}, [])
	const { confirmBooking, startAllocation, sncBar: sncBarForActions } = useBookingAction({ bookingId: bookingId })
	const bookingAction = useMemo(() => {
		if (booking) {
			switch (booking.status) {
				case BOOKING_STAGES.RECEIVED:
					return (
						<>
							{!formDisabled ? (
								<>
									<Button
										variant="outlined"
										mr={2}
										onClick={() => {
											editForm(false)
										}}>
										cancel
									</Button>
									<Button variant="outlined" className={classes.mr20} onClick={updateBooking}>
										Save
									</Button>
								</>
							) : (
								<>
									<Button
										variant="outlined"
										className={classes.mr20}
										onClick={() => {
											editForm(true)
										}}>
										Edit Details
									</Button>
									<Button
										disabled={!booking.isConfirmationReady}
										variant="outlined"
										color="primary"
										onClick={() => {
											setConfirmDialogProps({
												open: true,
												cancel: closeDialog,
												confirm: async () => {
													await confirmBooking()
													getBooking()
													closeDialog()
												},
												content: 'This action will move booking to confirmation state',
											})
										}}>
										Confirm
									</Button>
								</>
							)}
						</>
					)
				case BOOKING_STAGES.CONFIRMED:
					return (
						<>
							<Button
								variant="contained"
								onClick={async () => {
									setConfirmDialogProps({
										open: true,
										cancel: closeDialog,
										confirm: async () => {
											await startAllocation()
											getBooking()
											closeDialog()
										},
										content: 'This action will move booking to Allocation In progress state',
									})
								}}>
								Start Allocation
							</Button>
						</>
					)
				case BOOKING_STAGES.ALLOCATION_PENDING:
					return <></>
				case BOOKING_STAGES.ALLOCATION_ON_GOING:
					return (
						<>
							<Button variant="contained">View Job Cards</Button>
						</>
					)
			}
		}
	}, [booking, confirmBooking, startAllocation, updateBooking, editForm])

	return (
		<>
			<ConfirmationDialog {...confirmDialogProps} />
			<DashboardLayout>
				<Paper style={{ width: 'fit-content', margin: '0 auto' }} p={2}>
					<Box p={2} display="flex" justifyContent="space-between">
						<Typography variant="h4">Booking </Typography>
						<Box display="flex" justifyContent="flex-end">
							{bookingAction}
						</Box>
					</Box>

					<Typography variant="h5">Customer Provided Details</Typography>

					<Box className={classes.formContainer} display="flex" flexDirection="column">
						<InputLabel>Job Type</InputLabel>
						<Select
							disabled={true}
							name="jobType"
							value={form.values.jobType}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
							error={!!checkError('jobType')}
							variant="outlined">
							{getSelectOptions(JobTypeOptions)}
						</Select>
						{form.values.jobType !== 'none' && (
							<>
								<Typography variant="h6">I'm looking for</Typography>
								<Paper variant="outlined">
									<Box p={2}>
										{tags[form.values.jobType]?.map((tag) => (
											<Chip
												disabled={true}
												className={classes.mr20}
												clickable
												onClick={() => {
													if (!form.values.tags.includes(tag)) {
														form.setFieldValue('tags', [...form.values.tags, tag])
													}
												}}
												onDelete={
													form.values.tags.includes(tag)
														? () => {
																form.setFieldValue(
																	'tags',
																	form.values.tags?.filter((item) => item !== tag)
																)
														  }
														: undefined
												}
												key={tag}
												label={tag}></Chip>
										))}
									</Box>
								</Paper>
								<Typography variant="body2">
									Select the skills you are looking for from above. Mention below for other skills.
								</Typography>
								<TextField
									disabled={formDisabled}
									variant="outlined"
									placeholder="Other please specify"
									minRows={3}
									multiline
									name="otherJobType"
									error={checkError('otherJobType')}
									value={form.values.otherJobType}
									onChange={form.handleChange}
									onBlur={form.handleBlur}
								/>
							</>
						)}

						<InputLabel>Number of requirements</InputLabel>
						<Box display="flex" justifyContent="space-between">
							<TextField
								disabled={formDisabled}
								className={classes.mr20}
								type="number"
								variant="outlined"
								label="Helper*"
								name="qtyHelper"
								error={checkError('qtyHelper')}
								value={form.values.qtyHelper}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<TextField
								disabled={formDisabled}
								className={classes.mr20}
								type="number"
								variant="outlined"
								label="Technician*"
								name="qtyTechnician"
								error={checkError('qtyTechnician')}
								value={form.values.qtyTechnician}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<TextField
								disabled={formDisabled}
								type="number"
								variant="outlined"
								label="Supervisor*"
								name="qtySupervisor"
								error={checkError('qtySupervisor')}
								value={form.values.qtySupervisor}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
						</Box>
						<InputLabel>Shift Timing *</InputLabel>

						<Select
							name="shiftTime"
							disabled={formDisabled}
							value={form.values.shiftTime}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
							error={!!checkError('shiftTime')}
							variant="outlined">
							{getSelectOptions(shiftTimingOptions)}
						</Select>

						<InputLabel>Start Date *</InputLabel>

						<TextField
							type="date"
							disabled={formDisabled}
							variant="outlined"
							name={'startDate'}
							value={format(form.values.startDate, 'yyyy-MM-dd')}
							error={!!checkError('startDate')}
							onBlur={form.handleBlur}
							onChange={(e) => {
								form.setFieldValue(e.target.name, new Date(e.target.value))
							}}
						/>

						<FormControl disabled={formDisabled}>
							<FormLabel id="demo-row-radio-buttons-group-label">Booking Duration *</FormLabel>
							<RadioGroup
								name="durationType"
								value={form.values.durationType}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
								row>
								{bookingDurations.map((item) => {
									return <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
								})}
							</RadioGroup>
						</FormControl>

						<Box display="flex" justifyContent="space-between">
							<Box display="flex" flexDirection="column" className={classes.select}>
								<InputLabel>State *</InputLabel>

								<Select
									disabled={formDisabled}
									variant="outlined"
									name="state"
									error={!!checkError('state')}
									value={form.values.state}
									onChange={form.handleChange}
									onBlur={form.handleBlur}>
									<MenuItem value={'none'}>Select State</MenuItem>
									{getSelectOptions(states)}
								</Select>
							</Box>

							<Box display="flex" flexDirection="column" className={classes.select}>
								<InputLabel>City *</InputLabel>

								<Select
									disabled={formDisabled}
									variant="outlined"
									name="city"
									error={!!checkError('city')}
									value={form.values.city}
									onChange={form.handleChange}
									onBlur={form.handleBlur}>
									<MenuItem value={'none'}>Select city</MenuItem>
									{getSelectOptions(cities[form.values.state])}
								</Select>
							</Box>
						</Box>
						<TextField
							disabled={formDisabled}
							variant="outlined"
							placeholder="Site Address"
							minRows={3}
							multiline
							name="siteAddress"
							error={checkError('siteAddress')}
							value={form.values.siteAddress}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>

						<Typography variant="h5" align="center">
							Contact Details
						</Typography>
						<TextField
							disabled={formDisabled}
							variant="outlined"
							label="Company Name *"
							name="cmpName"
							error={checkError('cmpName')}
							value={form.values.cmpName}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
						<TextField
							disabled={formDisabled}
							variant="outlined"
							label="Name *"
							name="name"
							error={checkError('name')}
							value={form.values.name}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
						<TextField
							disabled={formDisabled}
							variant="outlined"
							label="Email *"
							name="email"
							error={checkError('email')}
							value={form.values.email}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
						<TextField
							disabled={formDisabled}
							variant="outlined"
							label="Phone Number *"
							name="phoneNumber"
							error={checkError('phoneNumber')}
							value={form.values.phoneNumber}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
						<Typography variant="h5" align="center">
							Additional Details
						</Typography>
						<InputLabel>Wage for worker Type</InputLabel>
						<Box display="flex" justifyContent="space-between">
							<TextField
								disabled={formDisabled}
								className={classes.mr20}
								type="number"
								variant="outlined"
								label="Helper*"
								name="wageHelper"
								error={checkError('wageHelper')}
								value={form.values.wageHelper}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<TextField
								disabled={formDisabled}
								className={classes.mr20}
								type="number"
								variant="outlined"
								label="Technician*"
								name="wageTechnition"
								error={checkError('wageTechnition')}
								value={form.values.wageTechnition}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<TextField
								disabled={formDisabled}
								type="number"
								variant="outlined"
								label="Supervisor*"
								name="wageSupervisor"
								error={checkError('wageSupervisor')}
								value={form.values.wageSupervisor}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
						</Box>
						<InputLabel>Over Time Details</InputLabel>
						<Box
							sx={{
								'&>*': {
									flex: 1,
								},
							}}
							display="flex"
							justifyContent="space-between">
							<TextField
								style={{ marginRight: '20px' }}
								disabled={formDisabled}
								type="number"
								variant="outlined"
								label="Over Time Factor *"
								name="overTimeRate"
								error={checkError('overTimeRate')}
								value={form.values.overTimeRate}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<TextField
								style={{ marginRight: '20px' }}
								disabled={formDisabled}
								type="number"
								variant="outlined"
								label="Over Time Buffer *"
								name="overTimeBuffer"
								error={checkError('overTimeBuffer')}
								value={form.values.overTimeBuffer}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<Select
								disabled={formDisabled}
								name="overTimeBufferType"
								value={form.values.overTimeBufferType}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
								error={!!checkError('overTimeBufferType')}
								variant="outlined">
								{getSelectOptions(overTimeBufferTypeOptions)}
							</Select>
						</Box>

						<InputLabel>Select the weekly days off</InputLabel>
						<Autocomplete
							disabled={formDisabled}
							multiple
							value={form.values.holidayDays}
							onChange={(e, val) => form.setFieldValue('holidayDays', val)}
							options={days}
							getOptionLabel={(option) => option}
							defaultValue={[]}
							renderInput={(params) => <TextField {...params} variant="outlined" label="Weekly Holiday" />}
						/>
						<Box display="flex">
							<FormControlLabel
								disabled={formDisabled}
								control={<Checkbox color="primary" />}
								label="Paid Holidays"
								name="isHolidayPaid"
								checked={form.values.isHolidayPaid}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<FormControlLabel
								disabled={formDisabled}
								control={<Checkbox color="primary" />}
								label="Getting Accomodation"
								name="accomodation"
								checked={form.values.accomodation}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<FormControlLabel
								disabled={formDisabled}
								control={<Checkbox color="primary" />}
								label="Getting Travel Allowance "
								name="travelAllowance"
								checked={form.values.travelAllowance}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
							<FormControlLabel
								disabled={formDisabled}
								control={<Checkbox color="primary" />}
								label="Getting Food"
								name="food"
								checked={form.values.food}
								onChange={form.handleChange}
								onBlur={form.handleBlur}
							/>
						</Box>
						<TextField
							disabled={formDisabled}
							variant="outlined"
							label="Phone Number *"
							name="phoneNumber"
							error={checkError('phoneNumber')}
							value={form.values.phoneNumber}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
						<InputLabel>Site Images</InputLabel>
						<Paper variant="outlined" style={{ padding: '16px' }}>
							<InputLabel>Selected Images</InputLabel>
							<Box style={{ display: 'flex', padding: '16px' }}>
								{siteImages?.map((file, index) => {
									return (
										<Grid item key={index}>
											<Paper variant="outlined" style={{ padding: '16px', marginRight: '20px' }}>
												<img style={{ height: '100px', width: '100px' }} src={URL.createObjectURL(file)} />
											</Paper>
										</Grid>
									)
								})}
							</Box>
							<InputLabel>Uploaded Images</InputLabel>
							<Box style={{ display: 'flex', padding: '16px' }}>
								{form.values.siteImages?.map((url, index) => {
									return (
										<Grid item key={index}>
											<Paper variant="outlined" style={{ padding: '16px', marginRight: '20px' }}>
												<img style={{ height: '100px', width: '100px' }} src={url} />
											</Paper>
										</Grid>
									)
								})}
							</Box>
						</Paper>
						<Box display="flex">
							<FileInput
								disabled={formDisabled}
								id="siteImages-upload"
								label="Select Files"
								multiple
								variant="outlined"
								onChange={(e) => {
									setSiteImages([...e.target.files])
								}}
							/>
							<Button
								variant="contained"
								disabled={formDisabled}
								onClick={() => {
									uploadImages('site')
								}}
								style={{ marginLeft: '20px' }}>
								Upload
							</Button>
						</Box>
						<InputLabel>Accommodation Images</InputLabel>

						<Paper variant="outlined" style={{ padding: '16px' }}>
							<InputLabel>Selected Images</InputLabel>
							<Box style={{ display: 'flex', padding: '16px' }}>
								{accomoImages?.map((file, index) => {
									return (
										<Grid item key={index}>
											<Paper variant="outlined" style={{ padding: '16px', marginRight: '20px' }}>
												<img style={{ height: '100px', width: '100px' }} src={URL.createObjectURL(file)} />
											</Paper>
										</Grid>
									)
								})}
							</Box>
							<InputLabel>Uploaded Images</InputLabel>
							<Box style={{ display: 'flex', padding: '16px' }}>
								{form.values.accomodationImages?.map((url, index) => {
									return (
										<Grid item key={index}>
											<Paper variant="outlined" style={{ padding: '16px', marginRight: '20px' }}>
												<img style={{ height: '100px', width: '100px' }} src={url} />
											</Paper>
										</Grid>
									)
								})}
							</Box>
						</Paper>
						<Box display="flex">
							<FileInput
								disabled={formDisabled}
								id="accomodationImages-upload"
								label="Select Files"
								multiple
								variant="outlined"
								onChange={(e) => {
									setAccomoImages([...e.target.files])
								}}
							/>
							<Button
								disabled={formDisabled}
								variant="contained"
								onClick={() => {
									uploadImages('accomodation')
								}}
								style={{ marginLeft: '20px' }}>
								Upload
							</Button>
						</Box>
					</Box>
				</Paper>
			</DashboardLayout>
			<PopAlert {...sncBar} />
			<PopAlert {...sncBarForActions} />
		</>
	)
}

export default BookingDetailed
