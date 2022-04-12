import React from 'react'
import { Box, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    flex: {
        gap: theme.spacing(4),
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    mediumFont: {
        fontSize: '0.9rem',
        [theme.breakpoints.up('md')]: {
            fontSize: '0.9rem',
        },
    },
}))

export const BookingDetailsHeader = (props) => {
    const { jobType, bookingId, status } = props
    const classes = useStyles()
    return (
        <Box className={classes.flex}>
            <Typography variant="h6" component="p" className={classes.spacing}>
                {jobType}
            </Typography>

            <Typography
                variant="body2"
                component="p"
                color="textSecondary"
                className={clsx(classes.spacing, classes.mediumFont)}
            >
                {`ID: ${bookingId}`}
            </Typography>
            <Typography
                variant="body2"
                component="p"
                color="textSecondary"
                className={clsx(classes.spacing, classes.mediumFont)}
            >
                {`Status: ${status}`}
            </Typography>
        </Box>
    )
}
