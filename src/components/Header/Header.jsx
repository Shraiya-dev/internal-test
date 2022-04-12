import { AppBar, Box, Button, Toolbar } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import projectHeroLogo from '../../assets/projectHero_02.svg'
import { useAuth } from '../../providers/AuthProvider'
import { ADD_PARTNER_ROUTE, HOME_ROUTE, LOGIN_ROUTE, REWARD_PENALTIES_ROUTE, TAP_ROUTE } from '../../routes'
import { SearchBar } from './SearchBar'

const useStyles = makeStyles((theme) => ({
    appbar: {
        // backgroundColor: '#C2CFD9',
    },
    toolbar: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
    },
    img: {
        maxWidth: '100%',
    },
    logoContainer: {
        width: theme.spacing(12),
    },
    btnContainer: {
        display: 'flex',
        gap: theme.spacing(3),
    },
}))

export const Header = () => {
    const classes = useStyles()
    const { pathname } = useLocation()
    const { isUserLoggedIn, logout } = useAuth()
    const navigate = useNavigate()

    const onButtonClicked = useCallback(() => {
        if (isUserLoggedIn) {
            return logout()
        }
        navigate('/login', {
            state: {
                from: pathname,
            },
        })
    }, [navigate, pathname, isUserLoggedIn, logout])

    const redirectToRewards = useCallback(() => {
        navigate(REWARD_PENALTIES_ROUTE, {
            state: {
                from: pathname,
            },
        })
    }, [navigate, pathname])

    const redirectToAddPartner = useCallback(() => {
        navigate(ADD_PARTNER_ROUTE, {
            state: {
                from: pathname,
            },
        })
    }, [navigate, pathname])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar color="primary" position="sticky" elevation={0} className={classes.appbar}>
                <Toolbar className={classes.toolbar} variant="dense">
                    <Link to={HOME_ROUTE}>
                        <div className={classes.logoContainer}>
                            <img className={classes.img} src={projectHeroLogo} alt="project hero" />
                        </div>
                    </Link>

                    <div className={classes.btnContainer}>
                        {pathname === HOME_ROUTE && (
                            <Button variant="outlined" onClick={redirectToAddPartner}>
                                Add Partner
                            </Button>
                        )}
                        {pathname === HOME_ROUTE && (
                            <Button variant="outlined" onClick={redirectToRewards}>
                                Reward & Penalties
                            </Button>
                        )}

                        {pathname === TAP_ROUTE && <SearchBar />}
                        {/* {pathname !== LOGIN_ROUTE && <ActionButtons />} */}
                        {pathname !== LOGIN_ROUTE && (
                            <Button className={classes.btn} onClick={onButtonClicked}>
                                {isUserLoggedIn ? 'Log Out' : 'Log In'}
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
