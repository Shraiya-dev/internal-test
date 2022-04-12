import {
    Box,
    Button,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import React from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { PopAlert } from '../../components/Snackbar'
import { useSearchWorker } from './useSearchWorker'

const AddWorkerForBooking = () => {
    const { form, sncBar, setSnackBar, checkError, workers } = useSearchWorker()
    return (
        <>
            <DashboardLayout>
                <Paper>
                    <form onSubmit={form.handleSubmit}>
                        <Box p={2} display="flex" justifyContent="center" alignItems="stretch">
                            <TextField
                                name="phoneNumber"
                                error={!!checkError('phoneNumber')}
                                value={form.values.phoneNumber}
                                helperText={form.errors.phoneNumber}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                style={{
                                    width: '250px',
                                    marginRight: '10px',
                                }}
                                variant="outlined"
                                label="Enter Worker Phone Number"
                            />
                            <Button
                                startIcon={<Search fontSize="large" />}
                                type="submit"
                                color="primary"
                                variant="contained"
                            >
                                search
                            </Button>
                        </Box>
                    </form>
                </Paper>
                <Box p={2}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S no.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Skill Type</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workers.map((worker, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{worker.name}</TableCell>
                                            <TableCell>{worker.skillType}</TableCell>
                                            <TableCell>{worker.city}</TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined">Add Worker</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DashboardLayout>
            <PopAlert {...sncBar} />
        </>
    )
}

export default AddWorkerForBooking
