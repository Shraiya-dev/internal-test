import React, { useRef } from 'react'
import { Box, Button } from '@material-ui/core'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { IconButton } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import PublishIcon from '@material-ui/icons/Publish'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import SaveIcon from '@material-ui/icons/Save'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useProfilePic } from '../../providers/ProfilePicProvider/ProfilePicProvider'
import clsx from 'clsx'
import { UploadProfile } from './UploadProfile'

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 60,
        height: 60,
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
        justifyContent: 'center',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
    },
}))

const EditButton = (props) => {
    const { classes } = props
    const { editProfilePic, onEditProfilePicClicked } = useProfilePic()

    if (editProfilePic) {
        return null
    }

    return (
        <IconButton onClick={onEditProfilePicClicked} size="small">
            <EditIcon className={classes.root} />
        </IconButton>
    )
}

const SmallAvatar = withStyles((theme) => ({
    root: {
        width: 20,
        height: 20,
        border: `2px solid ${theme.palette.background.paper}`,
        color: '#757575',
        backgroundColor: '#E5E7EB',
        padding: theme.spacing(0.4),
        borderRadius: '50%',
        cursor: 'pointer',
    },
}))(EditButton)

const EditAvatar = ({ profilePic }) => {
    const classes = useStyles()

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            badgeContent={<SmallAvatar />}
        >
            <Avatar aria-label="profile picture" className={classes.avatar} src={profilePic} />
        </Badge>
    )
}

const GoBack = ({ clickHandler }) => {
    const classes = useStyles()
    return (
        <IconButton onClick={clickHandler} className={classes.backButton} size="small">
            <ArrowBackIcon />
        </IconButton>
    )
}

const ActionButtons = () => {
    const classes = useStyles()
    const { onCancelClicked, onCancelOperationClicked } = useProfilePic()
    return (
        <Box pt={2} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <GoBack clickHandler={onCancelOperationClicked} />
            <Button onClick={onCancelClicked} variant="outlined" color="primary" className={classes.btn} size="small">
                Cancel
            </Button>
            <Button
                onClick={() => {
                }}
                variant="contained"
                className={clsx(classes.btn, classes.saveBtn)}
                endIcon={<SaveIcon />}
                size="small"
            >
                Save
            </Button>
        </Box>
    )
}

const EditPictureButtons = ({ url }) => {
    const classes = useStyles()
    const { onRemovePictureClicked, onCancelClicked, onOperationPerformed, previewImage, operationPerformed } =
        useProfilePic()

    const profilePicUploaderRef = useRef(null)

    const onUploadClicked = () => {
        profilePicUploaderRef?.current?.click()
    }

    return (
        <Box className={classes.flexBetween} pt={1}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <GoBack clickHandler={onCancelClicked} />
                {url && (
                    <IconButton size="small" onClick={onRemovePictureClicked}>
                        <ClearIcon />
                    </IconButton>
                )}
                <div>
                    <UploadProfile reference={profilePicUploaderRef} />
                    <IconButton size="small" onClick={onUploadClicked}>
                        <PublishIcon />
                    </IconButton>
                </div>
            </div>
        </Box>
    )
}

export const ProfilePic = ({ profilePic }) => {
    const { editProfilePic, previewImage, operationPerformed } = useProfilePic()

    let url = profilePic
    if (editProfilePic) {
        url = previewImage
    }

    let buttons = null

    if (editProfilePic) {
        if (operationPerformed) {
            buttons = <ActionButtons />
        } else {
            buttons = <EditPictureButtons url={url} />
        }
    }

    return (
        <div>
            <EditAvatar profilePic={url} />
            {buttons}
        </div>
    )
}
