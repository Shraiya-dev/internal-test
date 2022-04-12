import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { StatusIndicator } from '../ProfileDetail/components/StatusIndicator'

const useStyles = makeStyles((theme) => ({
    roundedBorderBox: {
        border: 'solid 1px #E5E7EB',
        borderRadius: theme.spacing(2),
    },
    subTitle: {
        fontSize: '0.9rem',
    },
    statusDot: {
        fontWeight: 'bold',
        fontSize: '1.25rem',
        color: '#10B981',
    },
    bold: {
        fontWeight: 'bold',
    },
}))

export const VaccinatedBadge = ({ vaccination }) => {
    const classes = useStyles()
    let vaccinationStatus = vaccination.status

    return (
        <Box p={1} sx={{ width: '95%' }}>
            <Box
                p={1}
                sx={{
                    margin: 'auto',
                    width: '90%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
                className={clsx(classes.roundedBorderBox)}
            >
                <Typography className={classes.subTitle}>Vaccination</Typography>
                <StatusIndicator vaccinationStatus={vaccinationStatus} />
            </Box>
        </Box>
    )
}
