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
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { BookingDurations, JobTypeOptions } from '../../constant/booking'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { getSelectOptions } from '../../utils/InputHelpers'
import { tags } from '../../utils/optionHelpers'
import { formatEnum } from '../../utils/stringHelpers'
import { getTimeOptions } from '../../utils/timeOptions'
import { useCreateBookingForm } from './hooks/useCreateBookingForm'

const CreateBookingForm = () => {
    const { project, customer, checkError, form } = useCreateBookingForm()
    const { showSnackbar } = useSnackbar()
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({
        open: false,
    })

    return (
        <DashboardLayout>
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

            <Box component={'form'} onSubmit={form.handleSubmit}>
                <Grid component={Paper} p={2} container md={12} lg={7} spacing={1}>
                    <Grid item xs={12}>
                        <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
                            <Typography variant="h4">Create Booking</Typography>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" color="error" onClick={() => form.resetForm()}>
                                    Reset
                                </Button>

                                <Button variant="contained" color="primary" type="submit">
                                    Submit
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Project Details
                        </Typography>
                    </Grid>
                    <Grid item container spacing={2} xs={12}>
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
                    <Grid item xs={12}>
                        <Divider />

                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Customer Details
                        </Typography>
                    </Grid>
                    <Grid container item spacing={2} xs={12}>
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

                    <Grid container item spacing={2} xs={12}>
                        <Grid item xs={12}>
                            <Divider />

                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Booking Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack>
                                <InputLabel>Job Type</InputLabel>
                                <Select
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
                                        <Grid container p={2} spacing={1}>
                                            {tags[form.values.jobType]?.map((tag) => (
                                                <Grid item>
                                                    <Chip
                                                        key={tag}
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
                                                                          form.values.tags?.filter(
                                                                              (item) => item !== tag
                                                                          )
                                                                      )
                                                                  }
                                                                : undefined
                                                        }
                                                        label={tag}
                                                    ></Chip>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </>
                        )}

                        {['Helper', 'Technician', 'Supervisor'].map((item) => {
                            return (
                                <Grid item xs={12} container spacing={1}>
                                    <Grid item xs={12}>
                                        <InputLabel>{item}</InputLabel>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            variant="outlined"
                                            label={item + ' Quantity*'}
                                            name={'qty' + item}
                                            error={checkError('qty' + item)}
                                            value={form.values['qty' + item]}
                                            onChange={(e) => {
                                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 500) {
                                                    form.handleChange(e)
                                                }
                                            }}
                                            onBlur={form.handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            disabled={Number(form.values['qty' + item]) === 0}
                                            type="number"
                                            variant="outlined"
                                            label={item + ' Wage*'}
                                            name={'wage' + item}
                                            error={!!checkError('wage' + item)}
                                            value={form.values['wage' + item]}
                                            onChange={(e) => {
                                                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 2000) {
                                                    form.handleChange(e)
                                                }
                                            }}
                                            onBlur={form.handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            disabled={Number(form.values['qty' + item]) === 0}
                                            type="number"
                                            variant="outlined"
                                            label={item + ' Daily Targets*'}
                                            name={'dt' + item}
                                            error={checkError('dt' + item)}
                                            value={form.values['dt' + item]}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            fullWidth
                                            disabled={Number(form.values['qty' + item]) === 0}
                                            variant="outlined"
                                            name={'pdu' + item}
                                            error={checkError('pdu' + item)}
                                            value={form.values['pdu' + item]}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                        >
                                            {getSelectOptions([
                                                { label: 'Select metric', value: 'none' },
                                                { label: 'sqft', value: 'sqft' },
                                                { label: 'sqmt', value: 'sqmt' },
                                                { label: 'kg', value: 'kg' },
                                            ])}
                                        </Select>
                                    </Grid>
                                </Grid>
                            )
                        })}

                        <Grid item xs={4}>
                            <InputLabel>Shift Start Timing *</InputLabel>
                            <Select
                                fullWidth
                                variant="outlined"
                                name={'shiftStartTime'}
                                value={form.values.shiftStartTime}
                                error={!!checkError('shiftStartTime')}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                            >
                                {getSelectOptions([
                                    { label: 'Select Start Time', value: 'none' },
                                    ...getTimeOptions('am'),
                                ])}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel>Shift End Timing *</InputLabel>
                            <Select
                                fullWidth
                                variant="outlined"
                                name={'shiftEndTime'}
                                value={form.values.shiftEndTime}
                                error={!!checkError('shiftEndTime')}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                            >
                                {getSelectOptions([
                                    { label: 'Select End Time', value: 'none' },
                                    ...getTimeOptions('pm'),
                                ])}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel>Start Date *</InputLabel>
                            <TextField
                                fullWidth
                                type="date"
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
                            <FormControl>
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
                        {/* <Grid container item xs={12}>
                            <Grid item xs={12}>
                                <InputLabel>Benefits</InputLabel>
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Getting Accommodation"
                                    name="accomodation"
                                    checked={form.values.accomodation}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Paid Travels "
                                    name="travelAllowance"
                                    checked={form.values.travelAllowance}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Getting Food"
                                    name="food"
                                    checked={form.values.food}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="PF"
                                    name="pf"
                                    checked={form.values.pf}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="ESI"
                                    name="esi"
                                    checked={form.values.esi}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Joining Bonus"
                                    name="joiningBonus"
                                    checked={form.values.joiningBonus}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Guaranteed Salary"
                                    name="guaranteedSalary"
                                    checked={form.values.guaranteedSalary}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Weekly Kharchi"
                                    name="weeklyKharchi"
                                    checked={form.values.weeklyKharchi}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox color="primary" />}
                                    label="Medical Support"
                                    name="medicalSupport"
                                    checked={form.values.medicalSupport}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                />
                            </Grid>
                        </Grid> */}
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    )
}

export default CreateBookingForm
