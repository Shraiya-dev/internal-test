// import { createTheme, ThemeProvider } from "@material-ui/core/styles";
//import AddWorker from './pages/Registration/Dashboard'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import { PrivateRoute } from './components'
import { AllocatedWorkers, AttendanceComponent, CustomerBookings, Login, WorkerProfile } from './pages'
import Attendance from './pages/Attendance'
import BookingById from './pages/Bookings/BookingById'
import Bookings from './pages/Bookings/Bookings'
import CreateBookings from './pages/Bookings/CreateBookings'
import Dashboard from './pages/Dashboard/Dashboard'
import JCA from './pages/JCA/jobCards'
import JobCards from './pages/jobCards/JobCards'
import Partner from './pages/Partner/Partner'
import Project from './pages/Project/Project'
import ProjectById from './pages/Project/ProjectById'
import { ProjectProvider } from './pages/Project/provider/ProjectProvider'
import RewardAndPenalty from './pages/Rewards'
import { WorkerProfileProvider } from './pages/WorkerProfile/providers/WorkerProfileProvider/WorkerProfileProvider'
import AddEditWorkerProfile from './pages/workers/AddEditWorkerProfile'
import AddWorkerForBooking from './pages/workers/AddWorkerForBooking'
import WorkerInfoTable from './pages/WorkersInfo/workerInfo'
import { BookingProvider } from './providers/BookingProvider'
import { LoaderProvider } from './providers/LoaderProvider'
import { SnackbarProvider } from './providers/SnackbarProvider'
import {
    ADD_PARTNER_ROUTE,
    ADD_WORKER_IN_BOOKING_ROUTE,
    ADD_WORKER_ROUTE,
    ATTENDANCE_ROUTE,
    BOOKINGS_ATTENDANCE_ROUTE,
    BOOKING_BOOKINGID_ROUTE,
    BOOKING_BY_ID_ROUTE,
    BOOKING_ROUTE,
    CUSTOMER_CUSTOMER_ID_BOOKINGS_CREATE,
    DASHBOARD_ROUTE,
    JCA_ROUTE,
    JOBCARDS_FOR_BOOKING_ROUTE,
    PROJECT_BY_ID_ROUTE,
    PROJECT_ROUTE,
    REWARD_PENALTIES_ROUTE,
    WORKER_INFO_BY_ID_ROUTE,
    WORKER_INFO_ROUTE,
} from './routes'

// const theme = createTheme({
// 	palette: {
// 		primary: {
// 			main: '#788896',
// 		},
// 		secondary: {
// 			main: '#C2CFD9',
// 		},
// 	},
// 	typography: {
// 		fontFamily: "'Inter', 'sans-serif'",
// 	},
// })
const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#244CB3',
            contrastText: '#fff',
            light: '#244CB3ef',
        },
    },
    components: {
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
        },
        // MuiOutlinedInput: {
        //     styleOverrides: {
        //         input: {
        //             padding: '0px',
        //         },
        //         root: {
        //             padding: '14px',
        //         },
        //     },
        // },
        MuiInput: {
            defaultProps: {
                disableUnderline: true,
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '14',
                    alignItems: 'center',
                },
            },
        },
    },
})

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={lightTheme}>
                <LoaderProvider>
                    <SnackbarProvider>
                        <div className="App">
                            <Routes>
                                {/* <Route
              path="/"
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              }
            /> */}
                                <Route
                                    path="/"
                                    element={
                                        <PrivateRoute>
                                            <CustomerBookings />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={BOOKINGS_ATTENDANCE_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <Attendance />
                                        </PrivateRoute>
                                    }
                                />
                                {/* added new route project */}
                                <Route
                                    path={PROJECT_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <Project />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={REWARD_PENALTIES_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <RewardAndPenalty />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={ADD_PARTNER_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <Partner />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={PROJECT_BY_ID_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <ProjectProvider>
                                                <ProjectById />
                                            </ProjectProvider>
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path={WORKER_INFO_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <WorkerInfoTable />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path={WORKER_INFO_BY_ID_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <AddEditWorkerProfile />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path={ADD_WORKER_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <AddEditWorkerProfile />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path={JOBCARDS_FOR_BOOKING_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <JobCards />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={ADD_WORKER_IN_BOOKING_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <AddWorkerForBooking />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={JCA_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <JCA />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={CUSTOMER_CUSTOMER_ID_BOOKINGS_CREATE}
                                    element={
                                        <PrivateRoute>
                                            <CreateBookings />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={DASHBOARD_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={BOOKING_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <Bookings />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={BOOKING_BY_ID_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <BookingProvider>
                                                <BookingById />
                                            </BookingProvider>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={BOOKING_BOOKINGID_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    }
                                />
                                {/* <Route
							path="/tap"
							element={
								<PrivateRoute>
								<TAP />
								</PrivateRoute>
							}
							/> */}

                                <Route
                                    path=":bookingId/workers/:status"
                                    element={
                                        <PrivateRoute>
                                            <AllocatedWorkers />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path={ATTENDANCE_ROUTE}
                                    element={
                                        <PrivateRoute>
                                            <AttendanceComponent />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/profile/:workerId/:bookingId"
                                    element={
                                        <PrivateRoute>
                                            <WorkerProfileProvider>
                                                <WorkerProfile />
                                            </WorkerProfileProvider>
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="/login" element={<Login />} />
                            </Routes>
                            <ToastContainer style={{ width: '600px', maxWidth: '100%' }} />
                        </div>
                    </SnackbarProvider>
                </LoaderProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
