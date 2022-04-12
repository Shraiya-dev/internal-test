import React from 'react'
import { useNavigate } from 'react-router-dom'

// Assets
import ProjectHeroLogo from '../../assets/images/projectHero_black_05_logo.svg'

// MUI Imports
import { makeStyles } from '@mui/styles'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'

// helpers
import { logout } from '../../helpers/api'

const useStyles = makeStyles({
    appbar: {
        backgroundColor: '#fff !important',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    img: {
        maxHeight: '25px',
        maxWidth: 'auto',
    },
})

const Navbar = (props) => {
    const classes = useStyles()
    const navigate = useNavigate()
    const handleClick = () => {
        logout()
        navigate('/')
    }
    return (
        <AppBar className={classes.appbar} position="static">
            <Toolbar className={classes.toolbar}>
                <img src={ProjectHeroLogo} alt="logo" className={classes.img} />
                <Button variant="outlined" onClick={handleClick} size="medium">
                    Log out
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
