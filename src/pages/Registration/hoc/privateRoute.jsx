import React from 'react'
import { Navigate } from 'react-router-dom'

// helpers
import { getToken } from '../helpers/common'

const PrivateRoute = ({ children }) => (getToken('accessToken') ? children : <Navigate to="/" />)

export default PrivateRoute
