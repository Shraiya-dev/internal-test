import { QuestionMark } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const ConfirmationDialog = ({ content, open = false, cancel, confirm }) => {
	return (
		<Dialog open={open}>
			<DialogContent sx={{ p: 4 }}>
				<Typography align="center" variant="h5">
					{content}
				</Typography>
			</DialogContent>
			<DialogActions
				sx={{
					p: 4,
				}}>
				<Button size="large" variant="outlined" onClick={cancel}>
					Cancel
				</Button>
				<Button size="large" variant="contained" onClick={confirm} autoFocus>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ConfirmationDialog
