import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, makeStyles } from '@material-ui/core'
import { ProfileCard } from './ProfileCard'
import { useGetProfiles } from '../hooks/useGetProfiles'
import { Loader } from '../../../components'
import { extractResponse } from '../../../utils'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        margin: 'auto',
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing(2),
            width: '80%',
        },
    },
}))

export const Profiles = () => {
    const classes = useStyles()
    const { bookingId, status } = useParams()
    const { isLoading, data, error } = useGetProfiles(bookingId, status)

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <p>{error?.message}</p>
    }

    const res = extractResponse(data)

    if (res?.error) {
        return <p>{res?.error}</p>
    }

    if (res?.data?.length === 0) {
        return <p>{'No profiles'}</p>
    }

    const profiles = res.data.workers

    return (
        <Container className={classes.container}>
            {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
            ))}
        </Container>
    )
}
