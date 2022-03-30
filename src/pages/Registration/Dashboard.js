import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import routes from "./utils/constants/routes";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./styles/core.css";
import PrivateRoute from "./hoc/privateRoute";
const customTheme = createTheme({
  typography: {
    fontFamily: ["Manrope", "sans-serif"].join(","),
    fontSize: 14,
  },
});

const Dashboard = () => {
  const checkIfPrivate = (access, element) => {
    if (access === "private") {
      return <PrivateRoute>{element}</PrivateRoute>;
    } else {
      return element;
    }
  };
  return (
    <ThemeProvider theme={customTheme}>
      <Router>
        <Switch>
          {Object.keys(routes).map((key) => {
            const { path, element, access } = routes[key];
            return (
              <Route
                key={key}
                path={path}
                element={checkIfPrivate(access, element)}
              />
            );
          })}
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default Dashboard;
