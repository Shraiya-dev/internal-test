import { Backdrop, CircularProgress } from '@mui/material'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { analytics } from '../hooks/analytics'

//creating snackbar context
const LoaderContext = createContext()
const { Provider, Consumer } = LoaderContext
const LoaderProvider = ({ children }) => {
    const [loader, setLoader] = useState(false)
    const showLoader = useCallback((val) => {
        setLoader(val)
    }, [])
    useEffect(() => {
        analytics.identify('hr_manager_chat_user', {})
    }, [])

    const loaderValue = useMemo(() => ({ showLoader: showLoader }), [showLoader])
    return (
        <Provider value={loaderValue}>
            {children}
            <Backdrop
                sx={{
                    zIndex: 1000000,
                }}
                open={loader}
            >
                <CircularProgress size={50} />
            </Backdrop>
        </Provider>
    )
}
export const useLoader = () => useContext(LoaderContext)

export { LoaderProvider, Consumer as LoaderConsumer, LoaderContext }
