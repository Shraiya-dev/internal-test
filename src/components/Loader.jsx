import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        placeItems: 'center',
        height: '300px',
    },
}))

export const Loader = () => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <CircularProgress size={40} />
        </div>
    )
}
