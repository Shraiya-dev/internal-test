// import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { QueryClient, QueryClientProvider } from 'react-query'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import { Header, PrivateRoute } from './components'
import { AllocatedWorkers, AttendanceComponent, CustomerBookings, Login, WorkerProfile } from './pages'
import Attendance from './pages/Attendance'
import BookingDetailed from './pages/Bookings/BookingDetails'
import Bookings from './pages/Bookings/Bookings'
import Dashboard from './pages/Dashboard/Dashboard'
import JobCards from './pages/jobCards/JobCards'
import Partner from './pages/Partner/Partner'
import RewardAndPenalty from './pages/Rewards'
import { WorkerProfileProvider } from './pages/WorkerProfile/providers/WorkerProfileProvider/WorkerProfileProvider'
import WorkerInfoTable from './pages/WorkersInfo/workerInfo'
//import AddWorker from './pages/Registration/Dashboard'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import AddWorkerForBooking from './pages/workers/AddWorkerForBooking'
import {
    ADD_PARTNER_ROUTE,
    ADD_WORKER_IN_BOOKING_ROUTE,
    BOOKING_BOOKINGID_ROUTE,
    BOOKING_BY_ID_ROUTE,
    BOOKING_ROUTE,
    DASHBOARD_ROUTE,
    JOBCARDS_FOR_BOOKING_ROUTE,
    REWARD_PENALTIES_ROUTE,
    WORKER_INFO_ROUTE,
    ADD_WORKER_ROUTE,
    WORKER_INFO_BY_ID_ROUTE,
    CUSTOMER_CUSTOMER_ID_BOOKINGS_CREATE,
    BOOKINGS_ATTENDANCE_ROUTE,
    ATTENDANCE_ROUTE,
    JCA_ROUTE,
} from './routes'
import Registration from './pages/Registration'
import AddEditWorkerProfile from './pages/workers/AddEditWorkerProfile'
import BookingById from './pages/Bookings/BookingById'
import { BookingProvider } from './providers/BookingProvider'
import { SnackbarProvider } from './providers/SnackbarProvider'
import CreateBookings from './pages/Bookings/CreateBookings'
import { LoaderProvider } from './providers/LoaderProvider'
import JCA from './pages/JCA/jobCards'

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
