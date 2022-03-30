import { Alert, Snackbar } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'

export const setSnackbar = (props, setData) => {
	setData({
		msg: '',
	})
	setData(props)
}
export const PopAlert = ({ msg, sev = 'info' }) => {
	const [snckBar, setSnckBar] = useState('')
	useEffect(() => {
		setSnckBar(msg)
	}, [msg])
	const handelClose = useCallback(() => {
		setSnckBar('')
	}, [])

	return (
		<Snackbar
			autoHideDuration={6000}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			open={!!snckBar}
			onClose={handelClose}>
			<Alert variant="filled" onClose={handelClose} severity={sev}>
				{snckBar}
			</Alert>
		</Snackbar>
	)
}
