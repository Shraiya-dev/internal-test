import { TabContext, TabPanel } from '@mui/lab'
import { Paper, Tab, Tabs, Stack, Grid, Typography, Button } from '@mui/material'
import { useCallback, useState } from 'react'
import { useSearchParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import AddEditProject from './AddEditProject'
import { useProjectDetails } from './provider/ProjectProvider'
import EmployeeDashboard from './EmployeeDashboard'
import { useEmployeeActions } from './hooks/useEmployeeAction'
import { AddEmployee } from './AddEmployee'
const ProjectById = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const handelTabChange = useCallback((e, val) => {
        const nsp = new URLSearchParams(searchParams)
        nsp.set('tab', val)
        setSearchParams(nsp)
    }, [])
    const [addEmployeeProps, setAddEmployeeProps] = useState({
        open: false,
        onClose: undefined,
        onConfirm: undefined,
    })
    const { customer, project } = useProjectDetails()
    const { addEmployeeToProject } = useEmployeeActions()

    return (
        <DashboardLayout>
            <AddEmployee {...addEmployeeProps} />

            <TabContext value={searchParams.get('tab') ?? 'details'}>
                <Paper>
                    <Grid container px={2} spacing={2}>
                        <Grid item>
                            <Typography variant="h4">{project?.name}</Typography>
                            <Typography variant="caption">Company Name: {customer?.companyName}</Typography>
                        </Grid>
                        <Grid ml="auto" display="flex" item>
                            <Button
                                fullWidth
                                onClick={() => {
                                    setAddEmployeeProps({
                                        open: true,
                                        onClose: () => {
                                            setAddEmployeeProps({ open: false })
                                        },
                                        onConfirm: async (values) => {
                                            await addEmployeeToProject(values)
                                        },
                                    })
                                }}
                                variant="contained"
                            >
                                Add Employee
                            </Button>
                        </Grid>
                        <Grid display="flex" item>
                            <Link style={{ display: 'flex' }} to={`/bookings?projectId=${project?._id}`}>
                                <Button fullWidth variant="outlined">
                                    View Bookings
                                </Button>
                            </Link>
                        </Grid>

                        <Grid display="flex" item>
                            <Link style={{ display: 'flex' }} to={`/attendance?projectId=${project?._id}`}>
                                <Button fullWidth variant="outlined">
                                    View Attendance
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Tabs value={searchParams.get('tab') ?? 'details'} onChange={handelTabChange}>
                        <Tab value="details" label="Project Details" />
                        <Tab value="employee" label="Manage Employees" />
                    </Tabs>
                    <TabPanel sx={{ maxHeight: '79vh', overflowY: 'auto', px: 0 }} value="details">
                        <AddEditProject />
                    </TabPanel>
                    <TabPanel sx={{ maxHeight: '79vh', overflowY: 'auto', px: 0 }} value="employee">
                        <EmployeeDashboard />
                    </TabPanel>
                </Paper>
            </TabContext>
        </DashboardLayout>
    )
}

export default ProjectById
