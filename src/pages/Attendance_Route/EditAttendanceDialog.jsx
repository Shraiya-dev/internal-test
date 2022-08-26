import { Search } from '@mui/icons-material'
import { DesktopTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import {
    Button,
    Chip,
    Dialog,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useEditAttendanceDialog from './hooks/useEditAttendanceDialog'

const EditAttendanceDialog = ({ open, data, onClose, field }) => {
    const {
        form,
        searchWorkerForm,
        workerDetail,
        setWorkerDetail,
        isError,
        deleteAttendance,
        deleteOT,
        dailyProductivityTypeValue,
    } = useEditAttendanceDialog(data, onClose, field)

    const [sp] = useSearchParams()
    console.log(data)
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'xs'}
            onClose={() => {
                searchWorkerForm.resetForm()
                setWorkerDetail()
                form.resetForm()
                onClose()
            }}
        >
            <Stack p={3}>
                <Stack justifyContent="space-between" direction="row">
                    <Typography variant="h4">Attendance</Typography>
                    <Typography variant="h5">{sp.get('date')}</Typography>
                </Stack>

                <form onSubmit={form.handleSubmit}>
                    <Stack direction={'column'} spacing={4} mt={4}>
                        {!data && (
                            <>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        fullWidth
                                        focused
                                        label="Worker PhoneNumber"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                        }}
                                        name="phoneNumber"
                                        value={searchWorkerForm.values.phoneNumber}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                                                searchWorkerForm.handleChange(e)
                                            }
                                        }}
                                    />

                                    <Button
                                        onClick={searchWorkerForm.handleSubmit}
                                        variant="contained"
                                        startIcon={<Search />}
                                    >
                                        Search
                                    </Button>
                                </Stack>
                                {workerDetail && (
                                    <Paper variant="outlined">
                                        <Stack p={2}>
                                            <Stack direction="row" spacing={2}>
                                                <Typography>
                                                    <strong>Name :</strong>
                                                    {workerDetail?.name}
                                                </Typography>
                                                <Typography>
                                                    <strong>Skill Type :</strong>
                                                    {workerDetail?.skillType}
                                                </Typography>
                                            </Stack>
                                            <Typography>
                                                <strong>Status :</strong>
                                                <Chip label={workerDetail?.status} />
                                            </Typography>
                                        </Stack>
                                    </Paper>
                                )}
                            </>
                        )}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            {field === 'ot' ? (
                                <Stack direction={'row'} spacing={2}>
                                    {/* <DesktopTimePicker
                                        disableOpenPicker
                                        label="OT Check In Time"
                                        value={form.values.otCheckedInTime}
                                        onError={() => {
                                            form.setFieldValue('otCheckedInTime', null)
                                        }}
                                        onChange={(date) => {
                                            form.setFieldValue('otCheckedInTime', date)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="otCheckedInTime"
                                                error={!!isError('otCheckedInTime')}
                                                onBlur={form.handleBlur}
                                                helperText={isError('otCheckedInTime')}
                                            />
                                        )}
                                    />
                                    <DesktopTimePicker
                                        disableOpenPicker
                                        onError={() => {
                                            form.setFieldValue('otCheckedOutTime', null)
                                        }}
                                        label="OT Check Out Time"
                                        value={form.values.otCheckedOutTime}
                                        onChange={(date) => {
                                            form.setFieldValue('otCheckedOutTime', date)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!isError('otCheckedOutTime')}
                                                name="otCheckedOutTime"
                                                onBlur={form.handleBlur}
                                                helperText={isError('otCheckedOutTime')}
                                            />
                                        )}
                                    /> */}
                                    <Select
                                        fullWidth
                                        value={form.values.dailyProductivityType}
                                        onChange={(e) => {
                                            form.setFieldValue('dailyProductivityType', e.target.value)
                                        }}
                                    >
                                        {dailyProductivityTypeValue?.map((value, index) => (
                                            <MenuItem key={index} value={value.value}>
                                                {value.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Stack>
                            ) : (
                                <Stack direction={'row'} spacing={2}>
                                    <DesktopTimePicker
                                        disableOpenPicker
                                        label="Check In Time"
                                        value={form.values.checkedInTime}
                                        onError={() => {
                                            form.setFieldValue('checkedInTime', null)
                                        }}
                                        onChange={(date) => {
                                            form.setFieldValue('checkedInTime', date)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="checkedInTime"
                                                error={!!isError('checkedInTime')}
                                                onBlur={form.handleBlur}
                                                helperText={isError('checkedInTime')}
                                            />
                                        )}
                                    />
                                    <DesktopTimePicker
                                        disableOpenPicker
                                        onError={() => {
                                            form.setFieldValue('checkedOutTime', null)
                                        }}
                                        label="Check Out Time"
                                        value={form.values.checkedOutTime}
                                        onChange={(date) => {
                                            form.setFieldValue('checkedOutTime', date)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!isError('checkedOutTime')}
                                                name="checkedOutTime"
                                                onBlur={form.handleBlur}
                                                helperText={isError('checkedOutTime')}
                                            />
                                        )}
                                    />
                                </Stack>
                            )}
                        </LocalizationProvider>
                        <Stack direction="row-reverse" justifyContent="space-between">
                            <Stack direction={'row'} justifyContent="end" spacing={1}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        searchWorkerForm.resetForm()
                                        form.resetForm()
                                        setWorkerDetail()
                                        onClose()
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained">
                                    Save
                                </Button>
                            </Stack>
                            {data && field !== 'ot' && (
                                <Button color="error" variant="outlined" onClick={deleteAttendance}>
                                    Delete Attendance
                                </Button>
                            )}
                            {data && field === 'ot' && (
                                <Button color="error" variant="outlined" onClick={deleteOT}>
                                    Delete OT
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </Dialog>
    )
}

export default EditAttendanceDialog
