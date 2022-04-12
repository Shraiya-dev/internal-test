import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ProfileSummary } from './components/ProfileSummary/ProfileSummary'
import { ProfileDetail } from './components/ProfileDetail/ProfileDetail'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { Loader } from '../../components'
import { extractResponse } from '../../utils'
import { VaccinationCertProvider } from './providers/VaccinationCertProvider/VaccinationCertProvider'
import { useWorkerProfile } from './providers/WorkerProfileProvider/WorkerProfileProvider'

const useStyles = makeStyles((theme) => {
    return {
        container: {
            [theme.breakpoints.up('sm')]: {
                width: '80%',
            },
            margin: 'auto',
            marginTop: theme.spacing(4),
        },
        layout: {
            display: 'flex',
            alignItems: 'stretch',
        },
    }
})

export const WorkerProfile = () => {
    const classes = useStyles()
    const { isLoading, data, error } = useWorkerProfile()

    if (error) {
        return <p>{error.message}</p>
    }

    const res = extractResponse(data)

    if (res?.error) {
        return <p>{res?.error}</p>
    }

    const worker = res?.data

    return (
        <Container className={classes.container}>
            {isLoading && <Loader />}
            {!isLoading && (
                <Grid container spacing={2} className={classes.layout}>
                    <ProfileSummary worker={worker} />
                    <VaccinationCertProvider>
                        <ProfileDetail worker={worker} />
                    </VaccinationCertProvider>
                </Grid>
            )}
        </Container>
    )
}
