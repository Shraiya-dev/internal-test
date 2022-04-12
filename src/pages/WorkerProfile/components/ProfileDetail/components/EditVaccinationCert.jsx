import React, { useEffect, useRef } from 'react'
import { Heading } from './Heading'
import EditIcon from '@material-ui/icons/Edit'
import PublishIcon from '@material-ui/icons/Publish'
import SaveIcon from '@material-ui/icons/Save'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Box, Button, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp'
import clsx from 'clsx'
import { useVaccinationCert } from '../../../providers/VaccinationCertProvider/VaccinationCertProvider'
import { UploadCertificate } from './UploadCertificate'

const useStyles = makeStyles((theme) => ({
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
    backButton: {
        [theme.breakpoints.up('md')]: {
            marginRight: theme.spacing(4),
        },
    },
    container: {
        display: 'block',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
        },
    },
}))

const GoBack = ({ clickHandler }) => {
    const classes = useStyles()
    return (
        <IconButton onClick={clickHandler} className={classes.backButton}>
            <ArrowBackIcon />
        </IconButton>
    )
}

const ActionButtons = () => {
    const classes = useStyles()
    const { onCancelClicked, onCancelOperationClicked } = useVaccinationCert()
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <GoBack clickHandler={onCancelOperationClicked} />
            <Button onClick={onCancelClicked} variant="outlined" color="primary" className={classes.btn} size="medium">
                Cancel
            </Button>
            <Button
                onClick={() => {
                    console.log('Save the edit/remove picture operation')
                }}
                variant="contained"
                className={clsx(classes.btn, classes.saveBtn)}
                endIcon={<SaveIcon />}
                size="medium"
            >
                Save
            </Button>
        </Box>
    )
}

const EditPictureButtons = ({ url }) => {
    const classes = useStyles()
    const { onRemovePictureClicked, onCancelClicked, onOperationPerformed, previewImage } = useVaccinationCert()

    const certUploaderRef = useRef(null)

    const onUploadClicked = () => {
        certUploaderRef?.current?.click()
    }

    return (
        <Box className={classes.flexBetween}>
            <GoBack clickHandler={onCancelClicked} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {url && (
                    <Button onClick={onRemovePictureClicked} variant="outlined" color="primary" className={classes.btn}>
                        Remove
                    </Button>
                )}
                <div>
                    <UploadCertificate reference={certUploaderRef} />
                    <Button
                        onClick={onUploadClicked}
                        variant="contained"
                        className={clsx(classes.btn, classes.saveBtn)}
                        endIcon={<PublishIcon />}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </Box>
    )
}

const downloadImage = (url) => {
    saveAs(url, 'vaccination_certificate.jpg')
}

const DownloadButton = ({ url }) => {
    return (
        <IconButton aria-label="download vaccination certificate" onClick={() => downloadImage(url)}>
            <GetAppIcon />
        </IconButton>
    )
}

const EditButton = () => {
    const { onEditVaccinationCertClicked } = useVaccinationCert()
    return (
        <IconButton onClick={onEditVaccinationCertClicked}>
            <EditIcon />
        </IconButton>
    )
}

export const EditPicture = ({ url }) => {
    const { editVaccinationCert, operationPerformed } = useVaccinationCert()

    let actionButtons = null
    if (editVaccinationCert) {
        actionButtons = operationPerformed ? <ActionButtons /> : <EditPictureButtons url={url} />
    }

    return (
        <>
            {editVaccinationCert ? (
                actionButtons
            ) : (
                <div>
                    <EditButton />
                    <DownloadButton url={url} />
                </div>
            )}
        </>
    )
}

export const EditVaccinationCert = ({ url }) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <Heading heading={'Certificate'} />
            <EditPicture url={url} />
        </div>
    )
}
