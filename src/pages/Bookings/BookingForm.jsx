import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
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
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { BookingDurations, JobTypeOptions } from '../../constant/booking'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { CTAMapByBookingType } from '../../utils/ctaHelpers'
import { getSelectOptions } from '../../utils/InputHelpers'
import { formatEnum } from '../../utils/stringHelpers'
import { getTimeOptions } from '../../utils/timeOptions'
import { useBookingForm } from './hooks/useBookingForm'

const BookingForm = () => {
    const { booking, project, customer, checkError, form, formDisabled, editForm, getBooking } = useBookingForm()
    const { showSnackbar } = useSnackbar()
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({
        open: false,
    })

    return (
        <>
            <ConfirmationDialog
                content={
                    <>
                        <Typography variant="h5">Save Changes ?</Typography>
                        <Typography pt={3}>
                            <Typography component="span" color="error">
                                <strong> Disclaimer:</strong>
                            </Typography>{' '}
                            Changes made to a Booking such as Wage and Benefits will only be propagated to Non-Deployed
                            JobCards. JobCards in DEPLOYMENT_COMPLETE state and already created Employees will continue
                            to have older attributes.
                        </Typography>
                    </>
                }
                cancel={() => {
                    setConfirmationDialogProps({ open: false })
                }}
                confirm={() => {
                    form.handleSubmit()
                    setConfirmationDialogProps({ open: false })
                }}
                open={confirmationDialogProps.open}
            />

            {CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.actions?.edit && (
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
                                        return
                                    }
                                    setConfirmationDialogProps({
                                        open: true,
                                    })
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
                    mt: CTAMapByBookingType[booking?.bookingType || 'FPH'][booking?.status]?.actions?.edit ? 8 : 0,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        Project Details
                    </Stack>
                </Typography>
                <Grid container spacing={2} item xs={12} md={7}>
                    <Grid item xs={12} md={4}>
                        <InputLabel>Project Name</InputLabel>
                        <Typography
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            color="primary.main"
                            variant="h6"
                        >
                            <Link to={`/projects/${project?._id}`}>{project?.name ?? 'No Name'}</Link>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>State</InputLabel>
                        <Typography variant="h6">{project?.state}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>City</InputLabel>
                        <Typography variant="h6">{project?.city}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>Site Address</InputLabel>
                        <Typography variant="h6">{project?.siteAddress}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Customer Details
                </Typography>
                <Grid container spacing={2} item xs={12} md={7}>
                    <Grid item xs={12} md={4}>
                        <InputLabel>Name</InputLabel>
                        <Typography variant="h6">{customer?.name}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>Company Name</InputLabel>
                        <Typography variant="h6">{customer?.companyName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>Email</InputLabel>
                        <Typography variant="h6">{customer?.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>PhoneNumber</InputLabel>
                        <Typography variant="h6">{customer?.phoneNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InputLabel>GSTIN</InputLabel>
                        <Typography variant="h6">{customer?.GSTIN}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Booking Details
                </Typography>
                <Grid container spacing={2} item xs={12} md={7}>
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

                    {form.values.jobType !== 'none' && booking?.tags?.length > 0 && (
                        <>
                            <Grid item xs={12}>
                                <Paper variant="outlined">
                                    <Box p={2}>
                                        {booking?.tags?.map((tag) => (
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
                    {/* <Grid item xs={12}>
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
                    </Grid> */}
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

                    <Grid item xs={4}>
                        <InputLabel>Shift Start Timing *</InputLabel>
                        <Select
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            name={'shiftStartTime'}
                            value={form.values.shiftStartTime}
                            error={!!checkError('shiftStartTime')}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        >
                            {getSelectOptions([{ label: 'Select Start Time', value: 'none' }, ...getTimeOptions('am')])}
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <InputLabel>Shift End Timing *</InputLabel>
                        <Select
                            fullWidth
                            disabled={formDisabled}
                            variant="outlined"
                            name={'shiftEndTime'}
                            value={form.values.shiftEndTime}
                            error={!!checkError('shiftEndTime')}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        >
                            {getSelectOptions([{ label: 'Select End Time', value: 'none' }, ...getTimeOptions('pm')])}
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
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
                                {BookingDurations.map((item) => {
                                    return (
                                        <FormControlLabel
                                            key={item}
                                            value={item}
                                            control={<Radio />}
                                            label={formatEnum(item)}
                                        />
                                    )
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <InputLabel>Over Time Details</InputLabel>
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

                    <Grid item xs={12}>
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
                </Grid>
            </Paper>
        </>
    )
}

export default BookingForm
