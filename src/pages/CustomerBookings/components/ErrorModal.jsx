import React from 'react'
import { Box, Modal, Typography, Button } from '@material-ui/core'
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    modalContainer: {
        backgroundColor: '#fff',
        minHeight: '200px',
        borderRadius: theme.spacing(1),
        width: '75%',
        [theme.breakpoints.up('sm')]: {
            width: '450px',
        },
        margin: 'auto',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        marginTop: '200px',
        padding: '2rem',
    },
    icon: {
        fontSize: '2.5rem',
        color: '#F59E0B',
    },
    errorMessage: {
        fontSize: '1.25rem',
    },
}))

export const ErrorModal = ({ message, open, handleClose }) => {
    const classes = useStyles()
    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            aria-labelledby="Error modal"
            aria-describedby="shows error state"
        >
            <Box className={classes.modalContainer}>
                <Box
                    sx={{
                        height: '90%',
                        display: 'flex',
                        gap: '2rem',
                        marginTop: 'auto',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <HourglassEmptyOutlinedIcon className={classes.icon} />
                    <Typography className={classes.errorMessage} color="textSecondary">
                        {message}
                    </Typography>
                    <Button size="large" variant="contained" color="primary" fullWidth onClick={handleClose}>
                        OK
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
