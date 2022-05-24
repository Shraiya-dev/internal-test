import { Search } from '@mui/icons-material'
import {
    Button,
    Dialog,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useCallback } from 'react'
import { PhoneField } from '../../components/CustomInputs'
import { OverTimeFactor } from '../../constant/booking'
import { LateralEmployeeType } from '../../constant/employee'
import { getSelectOptions } from '../../utils/InputHelpers'
import { getTimeOptions } from '../../utils/timeOptions'
import useAddEmployee from './hooks/useAddEmployee'

export const AddEmployee = ({ open, onClose, onConfirm }) => {
    const { form, formikProps, searchForm, searchFormikProps, workerDetails, resetForms } = useAddEmployee(
        onConfirm,
        onClose
    )
    const handleClose = useCallback(() => {
        onClose()
        resetForms()
    }, [onClose, resetForms])
    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
            <Stack p={5} spacing={2}>
                <Typography variant="h5">Search Employee</Typography>
                <form onSubmit={searchForm.handleSubmit}>
                    <Stack direction={'row'} spacing={1}>
                        <PhoneField
                            autofocus={true}
                            sx={{ flex: 1 }}
                            placeholder="Phone Number"
                            {...searchFormikProps('phoneNumber')}
                        />
                        <Button type="submit" variant="contained" startIcon={<Search />}>
                            Search
                        </Button>
                    </Stack>
                </form>
                <form
                    onSubmit={async (e) => {
                        form.handleSubmit(e)
                    }}
                >
                    {workerDetails && (
                        <>
                            <Typography variant="h5">Employee Details</Typography>
                            <Grid mb={2} mt={1} container spacing={2}>
                                <Grid item xs={12}>
                                    <Paper>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">
                                                    <strong>Name: </strong>
                                                    {workerDetails?.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">
                                                    <strong>Job Type: </strong>
                                                    {workerDetails?.jobType}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">
                                                    <strong>Phone Number: </strong>
                                                    {workerDetails?.phoneNumber}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">
                                                    <strong>Skill Type: </strong>
                                                    {workerDetails?.skillType}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormLabel>Lateral Employee Type *</FormLabel>
                                    <Select fullWidth {...formikProps('lateralType')}>
                                        {getSelectOptions([
                                            { label: 'Select Lateral Type', value: 'none' },
                                            ...LateralEmployeeType,
                                        ])}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>Wage</FormLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Wage"
                                        type="number"
                                        {...formikProps('wage')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>OT Rate</FormLabel>
                                    <Select fullWidth {...formikProps('otFactor')}>
                                        {getSelectOptions(OverTimeFactor)}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>Shift Start Timing *</FormLabel>
                                    <Select fullWidth {...formikProps('shiftStartTime')}>
                                        {getSelectOptions([
                                            { label: 'Select Start Time', value: 'none' },
                                            ...getTimeOptions('am'),
                                        ])}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>Shift End Timing *</FormLabel>
                                    <Select fullWidth {...formikProps('shiftEndTime')}>
                                        {getSelectOptions([
                                            { label: 'Select End Time', value: 'none' },
                                            ...getTimeOptions('pm'),
                                        ])}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl disabled={true} error={formikProps('hasPF').error}>
                                        <FormLabel>Provident Fund (PF) available?</FormLabel>
                                        <RadioGroup
                                            {...formikProps('hasPF')}
                                            onChange={(e) => {
                                                form.setFieldValue(e.target.name, e.target.value === 'true')
                                            }}
                                        >
                                            <Stack direction={'row'}>
                                                <FormControlLabel value={true} control={<Radio />} label={'YES'} />
                                                <FormControlLabel value={false} control={<Radio />} label={'No'} />
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl disabled={true} error={formikProps('hasESI').error}>
                                        <FormLabel>Employee State Insurance (ESI) provided?</FormLabel>
                                        <RadioGroup
                                            {...formikProps('hasESI')}
                                            onChange={(e) => {
                                                form.setFieldValue(e.target.name, e.target.value === 'true')
                                            }}
                                        >
                                            <Stack direction={'row'}>
                                                <FormControlLabel value={true} control={<Radio />} label={'YES'} />
                                                <FormControlLabel value={false} control={<Radio />} label={'No'} />
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    )}
                    <Stack direction="row" spacing={2}>
                        <Button onClick={handleClose} fullWidth variant="outlined">
                            cancel
                        </Button>
                        {workerDetails && (
                            <Button type="submit" fullWidth variant="contained">
                                Add Employee
                            </Button>
                        )}
                    </Stack>
                </form>
            </Stack>
        </Dialog>
    )
}
