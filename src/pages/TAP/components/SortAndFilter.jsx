import React from 'react'
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { JobTypeFilter } from './JobTypeFilter'
import { WorkerTypeFilter } from './WorkerTypeFilter'
import { StateFilter } from './StateFilter'
import { SortBy } from './SortBy'

const useStyles = makeStyles((theme) => ({
    header: {
        padding: theme.spacing(2),
        maxWidth: '95%',
        margin: 'auto',
        [theme.breakpoints.up('sm')]: {
            width: '95%',
        },
    },
    sortAndFilterContainer: {
        display: 'flex',
        // justifyContent: "space-between",
        flexShrink: 0,
        gap: theme.spacing(4),
    },
    filterContainer: {
        display: 'flex',
        gap: theme.spacing(2),
        width: '100%',
    },
}))

export const SortAndFilter = () => {
    const classes = useStyles()
    return (
        <div className={classes.header}>
            <div className={classes.sortAndFilterContainer}>
                <Typography variant="h6" component="h1">
                    Tap Workers
                </Typography>
                <div className={classes.filterContainer}>
                    <JobTypeFilter />
                    <WorkerTypeFilter />
                    <StateFilter />
                    <SortBy />
                    {/* <Button style={{ width: "200px" }}>Sort And Filter</Button> */}
                </div>
            </div>
        </div>
    )
}
