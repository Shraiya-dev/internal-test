import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isUserLoggedIn } = useAuth();

  return isUserLoggedIn ? (
    children
  ) : (
    <Navigate state={{ from: location.pathname }} replace to="/login" />
  );
};
