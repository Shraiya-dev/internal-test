import React from 'react'

// MUI Imports
import { makeStyles } from '@mui/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        '& svg': {
            width: 40,
            height: 40,
        },
    },
    successIcon: {
        color: '#4caf50',
    },
    errorIcon: {
        color: '#d32f2f',
    },
})

const SuccessModal = ({ success = false, message, showModal, closeModal }) => {
    const classes = useStyles()
    return (
        <Dialog
            open={showModal}
            onClose={closeModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className={classes.root}>
                {success ? (
                    <CheckCircleIcon className={classes.successIcon} />
                ) : (
                    <CancelIcon className={classes.errorIcon} />
                )}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default SuccessModal
