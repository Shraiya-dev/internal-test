import React from 'react'
import { Heading } from './Heading'
import { EditProfile } from './EditProfile'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}))

export const HeadingWithEditProfile = ({ heading }) => {
    const classes = useStyles()
    return (
        <div className={classes.flexBetween}>
            <Heading heading={heading} />
            <EditProfile />
            {/* make it smooth transition on
  hover */}
        </div>
    )
}
