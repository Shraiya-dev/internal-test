import React from 'react'
import clsx from 'clsx'
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined'
import { Typography, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { capitalize } from '../../../utils'

const useStyles = makeStyles((theme) => ({
    container: {
        gap: theme.spacing(4),

        [theme.breakpoints.up('md')]: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    displayFlex: {
        display: 'flex',
    },
    icons: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1.25rem',
        marginRight: '0.5rem',
    },
    mediumFont: {
        fontSize: '1rem',
    },
    spacing: {
        marginBottom: theme.spacing(1),
    },
}))

const DisplayWorker = ({ workerType, requirement }) => {
    const classes = useStyles()
    return (
        <div className={classes.displayFlex}>
            <PersonOutlineOutlinedIcon className={classes.icons} />
            <Typography
                variant="body2"
                component="p"
                color="textSecondary"
                className={clsx(classes.spacing, classes.mediumFont)}
            >
                {`${capitalize(workerType)}: ${requirement}`}
            </Typography>
        </div>
    )
}

export const WorkerDetails = ({ workerDetails }) => {
    const classes = useStyles()
    // const workerRequirements = Object.keys(workerDetails);

    return (
        <Box className={classes.container}>
            <DisplayWorker key={'1'} workerType={'HELPER'} requirement={workerDetails['HELPER']} />
            <DisplayWorker key={'2'} workerType={'TECHNICIAN'} requirement={workerDetails['TECHNICIAN']} />
            <DisplayWorker key={'3'} workerType={'SUPERVISOR'} requirement={workerDetails['SUPERVISOR']} />
            {/* {workerRequirements.map((workerType) => (
        <DisplayWorker
          key={workerType}
          workerType={workerType}
          requirement={workerDetails[workerType]}
        />
      ))} */}
        </Box>
    )
}
