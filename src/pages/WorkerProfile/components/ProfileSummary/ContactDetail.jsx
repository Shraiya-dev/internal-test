import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'

const useStyles = makeStyles((theme) => ({
    container: {
        width: '95%',
        paddingLeft: theme.spacing(2),
        marginTop: theme.spacing(0),
    },
    header: {
        textAlign: 'start',
        fontSize: '1rem',
        fontWeight: '600',
    },
    icon: {
        color: '#4B5563',
        padding: theme.spacing(1),
        borderRadius: '50%',
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        backgroundColor: '#E5E7EB',
        fontSize: '1.125rem',
    },
    contactDetail: {
        display: 'flex',
        alignItems: 'end',
        textDecoration: 'none',
    },
    contactInfo: {
        display: 'flex',
        alignItems: 'end',
        padding: theme.spacing(1),
    },
}))

function ContactDetail({ contactDetails }) {
    const classes = useStyles()
    const { phoneNumber, city, state } = contactDetails

    return (
        <section className={classes.container}>
            <Typography className={classes.header} component="p">
                Contact Details
            </Typography>
            <div className={classes.contactDetail}>
                <a href={`tel:${phoneNumber}`} className={classes.contactDetail}>
                    <PhoneOutlinedIcon className={classes.icon} />
                    <div className={classes.contactInfo}>
                        <Typography component="p">{phoneNumber}</Typography>
                    </div>
                </a>
            </div>
            {/* <div className={classes.contactDetail}>
        <EmailOutlinedIcon className={classes.icon} />
        <div className={classes.contactInfo}>
          <Typography component="p">example@gmail.com</Typography>
        </div>
      </div> */}
            <div className={classes.contactDetail}>
                <LocationOnOutlinedIcon className={classes.icon} />
                <div className={classes.contactInfo}>
                    <Typography component="p">{`${city} ${state && ', ' + state}`}</Typography>
                </div>
            </div>
        </section>
    )
}

export default ContactDetail
