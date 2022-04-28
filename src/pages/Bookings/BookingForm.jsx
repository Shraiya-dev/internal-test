import { CircularProgress } from '@material-ui/core'
import { Close } from '@mui/icons-material'
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import React from 'react'
import { FileInput } from '../../components/CustomInputs'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { CTAMap } from '../../utils/ctaHelpers'
import { cities, states } from '../../utils/data'
import { getSelectOptions } from '../../utils/InputHelpers'
import { bookingDurations } from './BookingDetails'
import { days, JobTypeOptions, overTimeBufferTypeOptions, shiftTimingOptions, tags } from './hooks/helpers'
import { useBookingForm } from './hooks/useBookingForm'

const BookingForm = () => {
    const {
        accomoImages,
        booking,
        checkError,
        form,
        formDisabled,
        setAccomoImages,
        setSiteImages,
        editForm,
        getBooking,
        siteImages,
        uploadImages,
        isUploadingImages,
    } = useBookingForm()
    const { showSnackbar } = useSnackbar()
    return (
        <>
            {CTAMap[booking?.status]?.actions?.edit && (
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    sx={{
                        position: 'fixed',
                        width: 'calc(100vw - 350px)',
                        margin: '-24px -24px',
                        background: '#efefef',
                        p: 2,
                        zIndex: 10,
                    }}
                >
                    {!formDisabled ? (
                        <>
                            <Button
                                sx={{ mr: 2 }}
                                variant="outlined"
                                onClick={() => {
                                    getBooking()
                                    editForm(false)
                                }}
                            >
                                cancel
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    if (!form.isValid) {
                                        showSnackbar({
                                            msg: 'Some Field are invalid!',
                                            sev: 'error',
                                        })
                                    }
                                    form.handleSubmit()
                                }}
                            >
                                Save
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    editForm(true)
                                }}
                            >
                                Edit Details
                            </Button>
                        </>
                    )}
                </Stack>
            )}

            <Paper
                sx={{
                    mt: CTAMap[booking?.status]?.actions?.edit ? 8 : 0,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Customer Provided Details
                </Typography>
                <Grid container spacing={2} item xs={12} md={8} lg={6}>
                    <Grid item xs={12}>
                        <Stack>
                            <InputLabel>Job Type</InputLabel>
                            <Select
                                disabled={true}
                                name="jobType"
                                value={form.values.jobType}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                error={!!checkError('jobType')}
                                variant="outlined"
                            >
                                {getSelectOptions(JobTypeOptions)}
                            </Select>
                        </Stack>
                    </Grid>

                    {form.values.jobType !== 'none' && (
                        <>
                            <Grid item xs={12}>
                                <Paper variant="outlined">
                                    <Box p={2}>
                                        {booking.tags?.map((tag) => (
                                            <Chip
                                                key={tag}
                                                disabled={true}
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
                                                label={tag}
                                            ></Chip>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            disabled={true}
                            type="number"
                            variant="outlined"
                            label="Other Job Types"
                            name="otherJobType"
                            error={checkError('otherJobType')}
                            value={form.values.otherJobType}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Number of requirements</InputLabel>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            type="number"
                            variant="outlined"
                            label="Helper*"
                            name="qtyHelper"
                            error={checkError('qtyHelper')}
                            value={form.values.qtyHelper}
                            onChange={(e) => {
                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 500) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            type="number"
                            variant="outlined"
                            label="Technician*"
                            name="qtyTechnician"
                            error={checkError('qtyTechnician')}
                            value={form.values.qtyTechnician}
                            onBlur={form.handleBlur}
                            onChange={(e) => {
                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 500) {
                                    form.handleChange(e)
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            type="number"
                            variant="outlined"
                            label="Supervisor*"
                            name="qtySupervisor"
                            error={checkError('qtySupervisor')}
                            value={form.values.qtySupervisor}
                            onChange={(e) => {
                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 500) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Shift Timing *</InputLabel>
                        <Select
                            fullWidth
                            name="shiftTime"
                            disabled={formDisabled}
                            value={form.values.shiftTime}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={!!checkError('shiftTime')}
                            variant="outlined"
                        >
                            {getSelectOptions(shiftTimingOptions)}
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Start Date *</InputLabel>
                        <TextField
                            fullWidth
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
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl disabled={formDisabled}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Booking Duration *</FormLabel>
                            <RadioGroup
                                name="durationType"
                                value={form.values.durationType}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                row
                            >
                                {bookingDurations.map((item) => {
                                    return <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Site Address *</InputLabel>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            name="siteAddress"
                            error={!!checkError('siteAddress')}
                            value={form.values.siteAddress}
                            onChange={(e) => {
                                if (e.target.value.length <= 500) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                            multiline
                            minRows={2}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>State *</InputLabel>
                        <Select
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            name="state"
                            error={!!checkError('state')}
                            value={form.values.state.toLowerCase()}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        >
                            <MenuItem value={'none'}>Select State</MenuItem>
                            {getSelectOptions(states)}
                        </Select>
                    </Grid>

                    <Grid item xs={6}>
                        <InputLabel>City *</InputLabel>
                        <Select
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            name="city"
                            error={!!checkError('city')}
                            value={form.values.city.toLowerCase()}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        >
                            <MenuItem value={'none'}>Select city</MenuItem>
                            {getSelectOptions(cities[form.values.state.toLowerCase()])}
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" mb={2}>
                            Contact Details
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            label="Company Name *"
                            name="cmpName"
                            error={checkError('cmpName')}
                            value={form.values.cmpName}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            label="Email *"
                            name="email"
                            type="email"
                            error={checkError('email')}
                            value={form.values.email}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            label="Phone Number *"
                            name="phoneNumber"
                            error={checkError('phoneNumber')}
                            value={form.values.phoneNumber.replace('+91', '')}
                            onChange={(e) => {
                                if (e.target.value.length <= 10) {
                                    form.handleChange(e)
                                    console.log(e.target.value)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
						<TextField
							fullWidth
							disabled={formDisabled}
							variant="outlined"
							label="Phone Number *"
							name="phoneNumber"
							error={checkError('phoneNumber')}
							value={form.values.phoneNumber}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
					</Grid> */}
                    <Grid item xs={12}>
                        <Typography variant="h6" mb={2}>
                            Additional Details
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Wage for worker Type</InputLabel>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled || Number(form.values.qtyHelper) === 0}
                            type="number"
                            variant="outlined"
                            label="Helper*"
                            name="wageHelper"
                            error={!!checkError('wageHelper')}
                            value={form.values.wageHelper}
                            onChange={(e) => {
                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 2000) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled || Number(form.values.qtyTechnician) === 0}
                            type="number"
                            variant="outlined"
                            label="Technician*"
                            name="wageTechnition"
                            error={checkError('wageTechnition')}
                            value={form.values.wageTechnition}
                            onChange={(e) => {
                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 2000) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled || Number(form.values.qtySupervisor) === 0}
                            type="number"
                            variant="outlined"
                            label="Supervisor*"
                            name="wageSupervisor"
                            error={checkError('wageSupervisor')}
                            value={form.values.wageSupervisor}
                            onChange={(e) => {
                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 2000) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Over Time Details</InputLabel>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <TextField
                            fullWidth
                            disabled={formDisabled}
                            type="number"
                            variant="outlined"
                            label="Over Time Factor *"
                            name="overTimeRate"
                            error={checkError('overTimeRate')}
                            value={form.values.overTimeRate}
                            onChange={(e) => {
                                if (e.target.value >= 0 && e.target.value <= 3) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        /> */}
                        <Select
                            fullWidth
                            disabled={formDisabled}
                            type="number"
                            variant="outlined"
                            name="overTimeRate"
                            error={checkError('overTimeRate')}
                            value={form.values.overTimeRate}
                            onChange={(e) => {
                                form.setFieldValue('overTimeRate', Number(e.target.value))
                            }}
                            onBlur={form.handleBlur}
                        >
                            <MenuItem value={'none'}>Select OT Factor</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={1.5}>1.5</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                        </Select>
                    </Grid>

                    {/* <Grid item xs={4}>
                        <TextField
                            fullWidth
                            disabled={formDisabled}
                            type="number"
                            variant="outlined"
                            label="Over Time Buffer *"
                            name="overTimeBuffer"
                            error={checkError('overTimeBuffer')}
                            value={form.values.overTimeBuffer}
                            onChange={(e) => {
                                if (e.target.value >= 0 && e.target.value <= 60) {
                                    form.handleChange(e)
                                }
                            }}
                            onBlur={form.handleBlur}
                        />
                    </Grid> */}

                    {/* <Grid item xs={4}>
                        <Select
                            fullWidth
                            disabled={formDisabled}
                            name="overTimeBufferType"
                            value={form.values.overTimeBufferType}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={!!checkError('overTimeBufferType')}
                            variant="outlined"
                        >
                            {getSelectOptions(overTimeBufferTypeOptions)}
                        </Select>
                    </Grid> */}
                    {/*<Grid item xs={12}>
						<InputLabel>Select the weekly days off</InputLabel>
					</Grid>
					 <Grid item xs={12}>
						<Autocomplete
							fullWidth
							disabled={formDisabled}
							multiple
							value={form.values.holidayDays}
							onChange={(e, val) => form.setFieldValue('holidayDays', val)}
							options={days}
							getOptionLabel={(option) => option}
							defaultValue={[]}
							renderInput={(params) => <TextField {...params} variant="outlined" label="Weekly Holiday" />}
						/>
					</Grid> */}
                    <Grid item xs={12}>
                        {/* <FormControlLabel
							disabled={formDisabled}
							control={<Checkbox color="primary" />}
							label="Paid Holidays"
							name="isHolidayPaid"
							checked={form.values.isHolidayPaid}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/> */}
                        <FormControlLabel
                            disabled={formDisabled}
                            control={<Checkbox color="primary" />}
                            label="Getting Accommodation"
                            name="accomodation"
                            checked={form.values.accomodation}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        />
                        <FormControlLabel
                            disabled={formDisabled}
                            control={<Checkbox color="primary" />}
                            label="Paid Travels "
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
                        <FormControlLabel
                            disabled={formDisabled}
                            control={<Checkbox color="primary" />}
                            label="PF"
                            name="pf"
                            checked={form.values.pf}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        />
                        <FormControlLabel
                            disabled={formDisabled}
                            control={<Checkbox color="primary" />}
                            label="ESI"
                            name="esi"
                            checked={form.values.esi}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        />
                    </Grid>

                    <Grid container spacing={2} item xs={12}>
                        <Grid display="flex" justifyContent="space-between" alignItems="center" item md={12}>
                            <InputLabel>Site Images</InputLabel>
                            <Stack>
                                <Typography variant="caption">Allowed: .jpg/.jpeg/.png</Typography>
                                <FileInput
                                    sx={{
                                        width: 150,
                                    }}
                                    accept="image/*"
                                    disabled={formDisabled}
                                    id="siteImages-upload"
                                    label={isUploadingImages.site ? <CircularProgress size={20} /> : 'Upload'}
                                    multiple
                                    variant="outlined"
                                    onChange={(e) => {
                                        uploadImages('site', [...e.target.files])
                                        e.target.value = ''
                                    }}
                                />
                                {/* <Button
									variant="contained"
									disabled={formDisabled || siteImages.length === 0}
									onClick={() => {
										// uploadImages('site')
									}}
									style={{ marginLeft: '20px' }}>
									Upload
								</Button> */}
                            </Stack>
                        </Grid>
                        {/* <Grid container spacing={2} item md={12}>
							<Grid item xs={12}>
								<InputLabel>SELECTED IMAGES</InputLabel>
							</Grid>
							{siteImages?.map((file, index) => {
								return (
									<Grid item xs={2} md={2} key={index}>
										<Paper
											sx={{
												position: 'relative',
											}}>
											<IconButton
												size="small"
												color="warning"
												disabled={formDisabled}
												onClick={() => {
													setSiteImages(siteImages.filter((img, idx) => idx !== index))
												}}
												sx={(theme) => ({
													backgroundColor: theme.palette.grey[600],
													color: '#fff',
													'&:hover': {
														backgroundColor: theme.palette.grey[500],
													},
													position: 'absolute',
													zIndex: 100,
													top: -15,
													right: -15,
												})}>
												<Close />
											</IconButton>
											<img style={{ height: '100%', width: '100%' }} src={URL.createObjectURL(file)} />
										</Paper>
									</Grid>
								)
							})}
						</Grid> */}
                        <Grid container spacing={2} item md={12}>
                            {/* <Grid item xs={12}>
								<InputLabel>UPLOADED IMAGES</InputLabel>
							</Grid> */}

                            {form.values.siteImages?.map((url, index) => {
                                return (
                                    <>
                                        <Grid item xs={2} md={2} key={index}>
                                            <Paper
                                                sx={{
                                                    position: 'relative',
                                                }}
                                            >
                                                {!formDisabled && (
                                                    <IconButton
                                                        disabled={formDisabled}
                                                        size="small"
                                                        onClick={() => {
                                                            form.setFieldValue(
                                                                'siteImages',
                                                                form.values.siteImages.filter((img) => img !== url)
                                                            )
                                                        }}
                                                        sx={(theme) => ({
                                                            backgroundColor: theme.palette.grey[600],
                                                            color: '#fff',
                                                            position: 'absolute',
                                                            zIndex: 100,
                                                            top: -10,
                                                            right: -10,
                                                        })}
                                                    >
                                                        <Close />
                                                    </IconButton>
                                                )}

                                                <img
                                                    style={{ height: '100%', width: '100%' }}
                                                    src={url}
                                                    alt={'image'}
                                                />
                                            </Paper>
                                        </Grid>
                                    </>
                                )
                            })}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} item xs={12}>
                        <Grid display="flex" justifyContent="space-between" alignItems="center" item md={12}>
                            <InputLabel>Accomodation Images</InputLabel>
                            <Stack>
                                <Typography variant="caption">Allowed: .jpg/.jpeg/.png</Typography>
                                <FileInput
                                    sx={{
                                        width: 150,
                                    }}
                                    accept="image/*"
                                    disabled={formDisabled}
                                    id="accomoImages-upload"
                                    label={isUploadingImages.accomodation ? <CircularProgress size={20} /> : 'Upload'}
                                    multiple
                                    variant="outlined"
                                    onChange={(e) => {
                                        uploadImages('accomodation', [...e.target.files])
                                        e.target.value = ''
                                    }}
                                />
                                {/* <FileInput
									disabled={formDisabled}
									id="accomoImages-upload"
									label="Select Files"
									multiple
									variant="outlined"
									onChange={(e) => {
										setAccomoImages([...e.target.files])
									}}
								/> */}
                                {/* <Button
									variant="contained"
									disabled={formDisabled || accomoImages.length === 0}
									onClick={() => {
										uploadImages('accomodation')
									}}
									style={{ marginLeft: '20px' }}>
									Upload
								</Button> */}
                            </Stack>
                        </Grid>
                        {/* <Grid container spacing={2} item md={12}>
							<Grid item xs={12}>
								<InputLabel>SELECTED IMAGES</InputLabel>
							</Grid>
							{accomoImages?.map((file, index) => {
								return (
									<Grid item xs={2} md={2} key={index}>
										<Paper
											sx={{
												position: 'relative',
											}}>
											<IconButton
												color="warning"
												size="small"
												onClick={() => {
													setAccomoImages(accomoImages.filter((img, idx) => idx !== index))
												}}
												disabled={formDisabled}
												sx={(theme) => ({
													backgroundColor: theme.palette.grey[600],
													color: '#fff',
													position: 'absolute',
													zIndex: 100,
													top: -10,
													right: -10,
												})}>
												<Close />
											</IconButton>
											<img style={{ height: '100%', width: '100%' }} src={URL.createObjectURL(file)} />
										</Paper>
									</Grid>
								)
							})}
						</Grid> */}
                        <Grid container spacing={2} item md={12}>
                            {/* <Grid item xs={12}>
								<InputLabel>UPLOADED IMAGES</InputLabel>
							</Grid> */}

                            {form.values.accomodationImages?.map((url, index) => {
                                return (
                                    <>
                                        <Grid item xs={2} md={2} key={index}>
                                            <Paper
                                                sx={{
                                                    position: 'relative',
                                                }}
                                            >
                                                {!formDisabled && (
                                                    <IconButton
                                                        size="small"
                                                        disabled={formDisabled}
                                                        onClick={() => {
                                                            form.setFieldValue(
                                                                'accomodationImages',
                                                                form.values.accomodationImages.filter(
                                                                    (img) => img !== url
                                                                )
                                                            )
                                                        }}
                                                        sx={(theme) => ({
                                                            backgroundColor: theme.palette.grey[600],
                                                            color: '#fff',
                                                            position: 'absolute',
                                                            zIndex: 100,
                                                            top: -10,
                                                            right: -10,
                                                        })}
                                                    >
                                                        {!formDisabled && <Close />}
                                                    </IconButton>
                                                )}

                                                <img
                                                    style={{ height: '100%', width: '100%' }}
                                                    src={url}
                                                    alt={'image'}
                                                />
                                            </Paper>
                                        </Grid>
                                    </>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default BookingForm
