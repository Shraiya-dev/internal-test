import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import {
  Bookings,
  TAP,
  Login,
  CustomerBookings,
  AllocatedWorkers,
  WorkerProfile,
} from "./pages";
import { QueryClient, QueryClientProvider } from "react-query";
import { PrivateRoute, Header } from "./components";
import { WorkerProfileProvider } from "./pages/WorkerProfile/providers/WorkerProfileProvider/WorkerProfileProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#788896",
    },
    secondary: {
      main: "#C2CFD9",
    },
  },
  typography: {
    fontFamily: "'Inter', 'sans-serif'",
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header />
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
          <ToastContainer style={{ width: "600px", maxWidth: "100%" }} />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
