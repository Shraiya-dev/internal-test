import { Alert, Snackbar } from '@mui/material'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

//creating snackbar context
const SnackbarContext = createContext()
const { Provider, Consumer } = SnackbarContext
const SnackbarProvider = ({ children }) => {
    const [snackbarProps, setSnackbarProps] = useState({
        open: false,
    })
    const handelClose = useCallback(() => {
        setSnackbarProps((p) => ({
            ...p,
            open: false,
        }))
    })
    const showSnackbar = useCallback((props) => {
        setSnackbarProps((p) => ({
            ...p,
            open: false,
        }))
        setSnackbarProps({
            ...props,
            open: true,
        })
    })

    const snackbarValue = useMemo(() => ({ showSnackbar: showSnackbar }), [showSnackbar])
    return (
        <Provider value={snackbarValue}>
            {children}

            <Snackbar
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarProps.open}
                onClose={handelClose}
            >
                <Alert variant="filled" onClose={handelClose} severity={snackbarProps?.sev ?? 'info'}>
                    {snackbarProps?.msg}
                </Alert>
            </Snackbar>
        </Provider>
    )
}
export const useSnackbar = () => useContext(SnackbarContext)

export { SnackbarProvider, Consumer as SnackbarConsumer, SnackbarContext }
