import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Paper,
    Select,
    Stack,
    TextField,
} from '@mui/material'
import React from 'react'
import { isError } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { PopAlert } from '../../components/Snackbar'
import { getSelectOptions } from '../../utils/InputHelpers'
import useAddWorkerDialog from './hooks/useAddWorkerDialog'

const skillTypeOptions = [
    { label: 'Select Skill Type*', value: 'none' },
    { label: 'Helper', value: 'HELPER' },
    { label: 'Supervisor', value: 'SUPERVISOR' },
    { label: 'Techician', value: 'TECHNICIAN' },
]

const AddWorkerDialog = ({ open, setOpen, jobIdForSkillType, setReload }) => {
    const { form, workerDetail, addWorkerJobCardAsRTD, isError, sncBar, setWorkerDetail } =
        useAddWorkerDialog(jobIdForSkillType)
    const handleClose = () => {
        form.resetForm()
        setWorkerDetail()
        setOpen(false)
    }
    const navigate = useNavigate()

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent
                    sx={{
                        maxWidth: '800px',
                    }}
                >
                    <Stack
                        direction="row"
                        sx={{
                            '&>*': {
                                ml: 0.5,
                                mr: 0.5,
                            },
                        }}
                    >
                        <Select
                            variant="outlined"
                            name="skillType"
                            value={form.values.skillType}
                            onChange={form.handleChange}
                            error={isError('skillType')}
                            onBlur={form.handleBlur}
                        >
                            {getSelectOptions(skillTypeOptions)}
                        </Select>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Contact Number"
                            name="phoneNumber"
                            value={form.values.phoneNumber}
                            onChange={(e) => {
                                if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                                    form.handleChange(e)
                                }
                            }}
                        />
                        <Button
                            sx={{
                                minWidth: 'fit-content',
                            }}
                            variant="contained"
                            onClick={form.handleSubmit}
                        >
                            Search
                        </Button>
                    </Stack>

                    {workerDetail && (
                        <Box style={{ marginTop: '20px' }}>
                            <Paper variant="outlined" style={{ padding: '20px' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                Job Type: {workerDetail.jobType}
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Chip label={workerDetail.status} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                Name: {workerDetail.name}
                                            </Grid>
                                            <Grid item xs={6}>
                                                Phone: {workerDetail.phoneNumber}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                Skill: {workerDetail.skillType}
                                            </Grid>
                                            <Grid item xs={6}>
                                                Exp: {workerDetail.experience} years
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                State: {workerDetail.state}
                                            </Grid>
                                            <Grid item xs={6}>
                                                City: {workerDetail.city}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={() => {
                                                navigate(`/workers/${workerDetail.workerId}`)
                                            }}
                                            variant="outlined"
                                        >
                                            Complete Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >
                    <Button variant="outlined" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        disabled={!workerDetail}
                        onClick={async () => {
                            await addWorkerJobCardAsRTD()
                            setReload(true)
                            handleClose()
                        }}
                        variant="contained"
                    >
                        Add Hero
                    </Button>
                </DialogActions>
            </Dialog>
            <PopAlert {...sncBar} />
        </>
    )
}

export default AddWorkerDialog
