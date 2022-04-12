import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    layout: {
        width: '95%',
        margin: 'auto',
        [theme.breakpoints.up('sm')]: {
            width: '80%',
        },
    },
}))

export const Layout = ({ children }) => {
    const classes = useStyles()
    return <div className={classes.layout}>{children}</div>
}
