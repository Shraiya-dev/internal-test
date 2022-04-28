import { Backdrop, CircularProgress } from '@mui/material'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

//creating snackbar context
const LoaderContext = createContext()
const { Provider, Consumer } = LoaderContext
const LoaderProvider = ({ children }) => {
    const [loader, setLoader] = useState(false)
    const showLoader = useCallback((val) => {
        setLoader(val)
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
