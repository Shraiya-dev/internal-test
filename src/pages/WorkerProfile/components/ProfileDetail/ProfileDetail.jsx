import React from 'react'
import { makeStyles, Grid, Box, Paper } from '@material-ui/core'
import { ProfileDetailHeader } from './components/ProfileDetailHeader'
import { WorkerDetailsTab } from './components/WorkerDetailsTab'
import { TrainingHistoryTab } from './components/TrainingHistoryTab'
import { WorkProfileTab } from './components/WorkProfileTab'
import { FinancialInformationTab } from './components/FinancialInformationTab'
import { VaccinationDetailsTab } from './components/VaccinationDetailsTab'
import { useWorkerProfile } from '../../providers/WorkerProfileProvider/WorkerProfileProvider'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        borderRadius: theme.spacing(1),
        overflow: 'visible',
    },
    item: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}))

export const ProfileDetail = ({ worker }) => {
    const classes = useStyles()
    const { vaccination } = worker

    const { activeTab } = useWorkerProfile()
    return (
        //set a fixed gap instead of margin and Grid
        <Grid item xs={12} sm={8} className={classes.item}>
            <Paper className={classes.root} variant="outlined">
                <ProfileDetailHeader />
                <Box>
                    {activeTab === '1' && <WorkerDetailsTab worker={worker} />}
                    {activeTab === '2' && <TrainingHistoryTab />}
                    {activeTab === '3' && <WorkProfileTab />}
                    {activeTab === '4' && <VaccinationDetailsTab vaccination={vaccination} />}
                    {activeTab === '5' && <FinancialInformationTab worker={worker} />}
                </Box>
            </Paper>
        </Grid>
    )
}
