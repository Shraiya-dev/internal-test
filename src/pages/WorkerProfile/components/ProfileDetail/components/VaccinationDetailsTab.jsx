import React from 'react'
import { Box, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { EditVaccinationCert } from './EditVaccinationCert'
import { useVaccinationCert } from '../../../providers/VaccinationCertProvider/VaccinationCertProvider'
import { NotKnown } from './NotKnown'

const useStyles = makeStyles((theme) => ({
    certContainer: {
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
    img: {
        maxWidth: '100%',
    },
    btn: {
        textTransform: 'none',
    },
    saveBtn: {
        backgroundColor: '#059669',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#065F46',
        },
    },
    flexBetween: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    btnContainer: {
        marginLeft: 'auto',
        width: 'max-content',
    },
}))

const VaccinationCert = ({ url }) => {
    const classes = useStyles()
    return <img className={classes.img} style={{ maxHeight: '400px' }} src={url} alt="vaccination certificate" />
}

export const VaccinationDetailsTab = ({ vaccination }) => {
    const classes = useStyles()
    const { editVaccinationCert, previewImage } = useVaccinationCert()

    let url = vaccination?.urlLink

    if (editVaccinationCert) {
        url = previewImage
    }

    return (
        <Box
            p={2}
            pt={1}
            sx={{
                minHeight: '450px',
            }}
        >
            <EditVaccinationCert url={url} />
            <Box mt={2}>
                <Paper variant="outlined">
                    <div className={classes.certContainer}>
                        {url ? <VaccinationCert url={url} /> : <NotKnown message={'Certificate not available'} />}
                    </div>
                </Paper>
            </Box>
        </Box>
    )
}
