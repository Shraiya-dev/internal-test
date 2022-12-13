import { Face, LibraryBooks, Person, Redeem } from '@mui/icons-material'
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import React, { useCallback, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import projectHeroLogo from '../../assets/brand-logo.svg'
import { VITE_PUBLIC_APP_ENV } from '../../env'
import { useAuth } from '../../providers/AuthProvider'
import {
    ADD_PARTNER_ROUTE,
    ATTENDANCE_ROUTE,
    BOOKING_ROUTE,
    PROJECT_ROUTE,
    JCA_ROUTE,
    REWARD_PENALTIES_ROUTE,
    WORKER_INFO_ROUTE,
    CUSTOMER_ROUTE,
    ORGANIZATION_ROUTE,
    ORDERS_INFO_ROUTE,
} from '../../routes'

const drawerWidth = 250

const DrawerList = [
    {
        label: 'Organization',
        icon: <Face />,
        link: ORGANIZATION_ROUTE,
    },
    {
        label: 'Customer',
        icon: <Face />,
        link: CUSTOMER_ROUTE,
    },
    {
        label: 'Projects',
        icon: <LibraryBooks />,
        link: PROJECT_ROUTE,
    },
    {
        label: 'Bookings',
        icon: <LibraryBooks />,
        link: BOOKING_ROUTE,
    },
    {
        label: 'Job Cards',
        icon: <LibraryBooks />,
        link: JCA_ROUTE,
    },
    {
        label: 'Rewards & Penalties',
        icon: <Redeem />,
        link: REWARD_PENALTIES_ROUTE,
    },
    {
        label: 'Partners',
        icon: <Face />,
        link: ADD_PARTNER_ROUTE,
    },
    {
        label: 'Workers',
        icon: <Face />,
        link: WORKER_INFO_ROUTE,
    },
    {
        label: 'Attendance',
        icon: <Face />,
        link: ATTENDANCE_ROUTE,
    },
    {
        label: 'Orders',
        icon: <Face />,
        link: ORDERS_INFO_ROUTE,
    },
].sort((left, right) => {
    if (left.label < right.label) {
        return -1
    }
    if (left.label > right.label) {
        return 1
    }
    return 0
})

const DashboardLayout = ({ children, loading = false }) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { isUserLoggedIn, logout } = useAuth()

    const menuBtnRef = useRef()
    const [menuOpen, setMenuOpen] = useState(false)
    const handleClose = useCallback(() => {
        setMenuOpen(false)
    }, [])
    const handelOpen = useCallback(() => {
        setMenuOpen(true)
    }, [])
    const { user } = useAuth()
    const sp = new URLSearchParams()
    sp.set('date', format(new Date(), 'dd/MM/yy'))

    const handelLogout = useCallback(() => {
        if (isUserLoggedIn) {
            return logout()
        }
        navigate('/login', {
            state: {
                from: pathname,
            },
        })
    }, [isUserLoggedIn, pathname])

    return (
        <>
            <AppBar
                position="fixed"
                color="primary"
                variant="outlined"
                elevation={0}
                sx={(theme) => ({
                    p: 1,
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: '#fff !important',
                })}
            >
                <Toolbar
                    sx={{
                        p: 0,

                        justifyContent: 'space-between',
                    }}
                >
                    <img style={{ height: '40px' }} src={projectHeroLogo} alt="project hero" />
                    <Typography variant="h4" color="common.black">
                        {VITE_PUBLIC_APP_ENV === 'DEV' || (VITE_PUBLIC_APP_ENV === 'STAGE' && VITE_PUBLIC_APP_ENV)}
                    </Typography>
                    <IconButton color="primary" ref={menuBtnRef} onClick={handelOpen}>
                        <Person />
                    </IconButton>
                    <Menu anchorEl={menuBtnRef.current} open={menuOpen} onClose={handleClose}>
                        <MenuItem onClick={handleClose}>{user.phoneNumber}</MenuItem>
                        <MenuItem onClick={handelLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                PaperProps={{
                    sx: {
                        width: drawerWidth,
                        paddingTop: 12,
                    },
                }}
            >
                <List>
                    {DrawerList.map((item, index) => (
                        <ListItem
                            sx={(theme) => ({
                                backgroundColor: pathname.includes(item.link) ? theme.palette.primary.main : null,
                                color: pathname.includes(item.link) ? theme.palette.primary.contrastText : '#000',
                                p: 2,
                                '&:hover': {
                                    backgroundColor: pathname.includes(item.link) ? theme.palette.primary.light : null,
                                },
                            })}
                            button
                            component={Link}
                            key={index}
                            to={item.link == ATTENDANCE_ROUTE ? `${item.link}?${sp.toString()}` : item.link}
                        >
                            {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                            {item.label}
                        </ListItem>
                    ))}
                </List>
                {/* <List style={{ margin: 'auto 0 0' }}>
						<ListItem
							button
							sx={(theme) => ({
								p: 2,
							})}
							onClick={handelLogout}>
							<ListItemIcon>
								<ExitToApp />
							</ListItemIcon> 
							<ListItemText primary={'Logout'} />
						</ListItem>
					</List>
					 <Tabs
						orientation="vertical"
						variant="scrollable"
						aria-label="Vertical tabs example"
						sx={{ borderRight: 1, borderColor: 'divider' }}>
						{DrawerList.map((item, index) => {
							return (
								<Tab
									label={item.label}
									onClick={() => {
										if (isUserLoggedIn) {
											return logout()
										}
										navigate('/login', {
											state: {
												from: pathname,
											},
										})
									}}
								/>
							)
						})}
					</Tabs> */}
            </Drawer>
            <main
                style={{
                    flexGrow: 1,
                    paddingTop: '82px',
                    paddingLeft: drawerWidth,
                    position: 'relative',
                }}
            >
                {loading && <LinearProgress sx={{ minHeight: 5, width: '100%', position: 'absolute', top: 82 }} />}

                <Box
                    sx={{
                        p: 3,
                        pb: 0,
                    }}
                >
                    {/* <Button
						onClick={() => {
							navigate(-1)
						}}
						sx={{
							fontSize: '16px',
							p: 0,
							color: '#616161',

							justifyContent: 'flex-start',
						}}>
						<KeyboardBackspace
							sx={{
								fontSize: 24,
							}}
						/>
						Back
					</Button> */}
                    {children}
                </Box>
            </main>
        </>
    )
}

export default DashboardLayout
