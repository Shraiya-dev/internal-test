import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {
    Button,
    Chip,
    Container,
    FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { BookingDurations, JobTypeOptions } from '../../constant/booking'
import { CityOptions } from '../../constant/city'
import { StatesOptions } from '../../constant/state'
import { getSelectOptions } from '../../utils/InputHelpers'
import { ShiftTime, tags } from '../../utils/optionHelpers'
import useCreateBookings from './hooks/useCreateBookings'

const CreateBookings = () => {
    const { form, checkError } = useCreateBookings()
    const [activeStep, setActiveStep] = useState(0)

    return (
        <DashboardLayout>
            <Container
                sx={{
                    p: 0,
                }}
            >
                <Paper
                    sx={{
                        py: 4,
                        px: 10,
                    }}
                >
                    <Stepper
                        sx={{
                            py: 4,
                            px: 0,
                        }}
                        // alternativeLabel
                        activeStep={activeStep}
                    >
                        <Step>
                            <StepLabel>Worker Requirements</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Contact Details</StepLabel>
                        </Step>
                    </Stepper>
                    <form>
                        <Grid container spacing={2}>
                            {activeStep === 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">Job Type</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Select
                                            fullWidth
                                            name="jobType"
                                            value={form.values.jobType}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('jobType')}
                                        >
                                            <MenuItem value="none">Select Job Types</MenuItem>
                                            {getSelectOptions(JobTypeOptions)}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">I am Looking For</Typography>{' '}
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Stack direction="row" flexWrap="wrap">
                                                {tags[form.values.jobType]?.map((item) => {
                                                    return (
                                                        <Chip
                                                            sx={{
                                                                m: 1,
                                                            }}
                                                            color={
                                                                form.values.tags.includes(item) ? 'primary' : undefined
                                                            }
                                                            key={item}
                                                            label={item}
                                                            clickable
                                                            onClick={
                                                                !form.values.tags.includes(item)
                                                                    ? () => {
                                                                          form.setFieldValue('tags', [
                                                                              ...form.values.tags,
                                                                              item,
                                                                          ])
                                                                      }
                                                                    : undefined
                                                            }
                                                            onDelete={
                                                                form.values.tags.includes(item)
                                                                    ? () => {
                                                                          form.setFieldValue('tags', [
                                                                              ...form.values.tags.filter(
                                                                                  (val) => val !== item
                                                                              ),
                                                                          ])
                                                                      }
                                                                    : undefined
                                                            }
                                                        />
                                                    )
                                                })}
                                            </Stack>
                                        </Paper>
                                        <Typography variant="caption">
                                            Select the skills you are looking for from above. Mention below for other
                                            skills.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="otherJobType"
                                            value={form.values.otherJobType}
                                            onChange={form.handleChange}
                                            label="Other Job Type"
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('otherJobType')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">No of requirements</Typography>
                                        <Stack direction={'row'} spacing={2}>
                                            <TextField
                                                name="qtyHelper"
                                                value={form.values.qtyHelper}
                                                onChange={(e) => {
                                                    if (e.target.value >= 0) {
                                                        form.handleChange(e)
                                                    }
                                                }}
                                                type="number"
                                                fullWidth
                                                label="Helper*"
                                                onBlur={form.handleBlur}
                                                error={!!checkError('qtyHelper')}
                                            />
                                            <TextField
                                                name="qtyTechnician"
                                                value={form.values.qtyTechnician}
                                                onChange={(e) => {
                                                    if (e.target.value >= 0) {
                                                        form.handleChange(e)
                                                    }
                                                }}
                                                fullWidth
                                                type="number"
                                                label="Technician *"
                                                onBlur={form.handleBlur}
                                                error={!!checkError('qtyTechnician')}
                                            />
                                            <TextField
                                                name="qtySupervisor"
                                                value={form.values.qtySupervisor}
                                                onChange={(e) => {
                                                    if (e.target.value >= 0) {
                                                        form.handleChange(e)
                                                    }
                                                }}
                                                fullWidth
                                                type="number"
                                                label="Supervisor*"
                                                onBlur={form.handleBlur}
                                                error={!!checkError('qtySupervisor')}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6">Shift Time</Typography>
                                        <Select
                                            name="shiftTime"
                                            fullWidth
                                            value={form.values.shiftTime}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('shiftTime')}
                                        >
                                            {ShiftTime.map((options) => {
                                                return (
                                                    <MenuItem key={options.value} value={options.value}>
                                                        {options.label}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6">Start Date</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                value={form.values.date}
                                                disablePast
                                                onBlur={form.handleBlur}
                                                onChange={(newValue) => {
                                                    form.setFieldValue('date', newValue)
                                                }}
                                                renderInput={(params) => <TextField fullWidth {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">Booking duration</Typography>
                                        <RadioGroup
                                            name="bookingDuration"
                                            value={form.values.bookingDuration}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                        >
                                            <Stack direction={'row'} spacing={2}>
                                                {BookingDurations.map((options) => {
                                                    return (
                                                        <FormControlLabel
                                                            key={options.value}
                                                            value={options.value}
                                                            control={<Radio />}
                                                            label={options.label}
                                                        />
                                                    )
                                                })}
                                            </Stack>
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            fullWidth
                                            name="state"
                                            value={form.values.state}
                                            onChange={(e) => {
                                                form.handleChange(e)
                                                form.setFieldValue('city', 'none')
                                            }}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('state')}
                                        >
                                            <MenuItem value={'none'}>Select State</MenuItem>
                                            {getSelectOptions(StatesOptions)}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            fullWidth
                                            name="city"
                                            value={form.values.city}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('city')}
                                        >
                                            <MenuItem value={'none'}>Select city</MenuItem>
                                            {getSelectOptions(CityOptions[form.values.state.toLowerCase()])}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Site address"
                                            name="address"
                                            value={form.values.address}
                                            onChange={form.handleChange}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('address')}
                                        />
                                    </Grid>
                                </>
                            )}
                            {activeStep === 1 && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            fullWidth
                                            label="Company Name"
                                            name="companyName"
                                            value={form.values.companyName}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('companyName')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={form.values.name}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('name')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            type="number"
                                            name="phoneNumber"
                                            value={form.values.phoneNumber}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 10) {
                                                    form.handleChange(e)
                                                }
                                            }}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('phoneNumber')}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={form.values.email}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            error={!!checkError('email')}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Stack
                            sx={{
                                '&>*': {
                                    width: 120,
                                },
                            }}
                            direction="row-reverse"
                            my={2}
                            justifyContent="space-between"
                        >
                            <Button
                                variant="contained"
                                disabled={form.values.jobType === 'none'}
                                onClick={
                                    activeStep === 1
                                        ? (e) => {
                                              form.handleSubmit(e)
                                          }
                                        : async () => {
                                              if (
                                                  !!form.errors.jobType ||
                                                  !!form.errors.state ||
                                                  !!form.errors.city ||
                                                  !!form.errors.address ||
                                                  !!form.errors.shiftTime
                                              ) {
                                                  await form.setTouched({
                                                      jobType: true,
                                                      tags: true,
                                                      otherJobType: true,
                                                      qtyHelper: true,
                                                      qtyTechnician: true,
                                                      qtySupervisor: true,
                                                      shiftTime: true,
                                                      date: true,
                                                      bookingDuration: true,
                                                      state: true,
                                                      city: true,
                                                      address: true,
                                                  })
                                              } else {
                                                  setActiveStep(activeStep + 1)
                                              }
                                          }
                                }
                            >
                                {activeStep === 1 ? 'Submit' : 'Next'}
                            </Button>
                            {activeStep === 1 && (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (activeStep >= 1) {
                                            setActiveStep(activeStep - 1)
                                        }
                                    }}
                                >
                                    Previous
                                </Button>
                            )}
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </DashboardLayout>
    )
}

export default CreateBookings
