import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useEffect, useState, useCallback } from 'react'

export const setSnackbar = (props, setData) => {
	setData({
		msg: '',
	})
	setData(props)
}
export const PopAlert = ({ msg, sev }) => {
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
			<Alert onClose={handelClose} severity={sev ?? 'info'}>
				{snckBar}
			</Alert>
		</Snackbar>
	)
}
