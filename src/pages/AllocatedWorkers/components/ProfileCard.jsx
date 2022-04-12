import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { capitalize } from '../../../utils'
import { useNavigate, useParams } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '95%',
        '&:hover': {
            cursor: 'pointer',
        },
        margin: 'auto',
        [theme.breakpoints.up('sm')]: {
            minWidth: 345,
            margin: theme.spacing(0),
        },
        marginBottom: theme.spacing(2),
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    header: {
        paddingBottom: theme.spacing(2),
    },
    content: {
        borderTop: 'solid 1px #D1D5DB',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    icons: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1.25rem',
        marginRight: '0.5rem',
    },
    font: {
        fontSize: '1rem',
    },
    fontSmall: {
        fontSize: '0.9rem',
    },
    flex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}))

export const ProfileCard = ({ profile }) => {
    const navigate = useNavigate()
    const classes = useStyles()
    const { name, pp, rating, id } = profile
    const { bookingId } = useParams()

    const location = `${profile.city} ${(profile.state && ', ', profile.state)}`

    const onProfileCardClicked = () => navigate(`/profile/${id}/${bookingId}`)

    return (
        <Card className={classes.root} onClick={onProfileCardClicked}>
            <CardHeader
                className={classes.header}
                avatar={<Avatar aria-label="profile picture" className={classes.avatar} src={pp} />}
                title={
                    <Typography gutterBottom className={classes.font} variant="h5" component="h2">
                        {name}
                    </Typography>
                }
                subheader={capitalize(profile.workerType)}
            />

            <CardContent className={clsx(classes.content, classes.flex)}>
                <Rating name="read-only" value={parseInt(rating, 10)} readOnly size="small" />
                <div className={classes.flex}>
                    <LocationOnOutlinedIcon className={classes.icons} />
                    <Typography className={classes.fontSmall} color="textSecondary">
                        {location}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    )
}
