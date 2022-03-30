import { Face, KeyboardBackspace, LibraryBooks, Person, Redeem } from '@mui/icons-material'
import {
	AppBar,
	Box,
	Button,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useCallback, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import projectHeroLogo from '../../assets/brand-logo.svg'
import { useAuth } from '../../providers/AuthProvider'
import { ADD_PARTNER_ROUTE, BOOKING_ROUTE, REWARD_PENALTIES_ROUTE, WORKER_INFO_ROUTE } from '../../routes'

const drawerWidth = 250

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: `${theme.zIndex.drawer + 1} !important`,
		backgroundColor: '#fff !important',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		border: 'none',
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerContainer: {
		overflow: 'auto',
		paddingTop: '90px',
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		flexGrow: 1,
		paddingTop: '72px',
		paddingLeft: drawerWidth,
	},
}))

const DrawerList = [
	{
		label: 'Bookings',
		icon: <LibraryBooks />,
		link: BOOKING_ROUTE,
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
]

const DashboardLayout = ({ children }) => {
	const classes = useStyles()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { isUserLoggedIn, logout } = useAuth()

	const redirectTo = useCallback(
		(url) => {
			navigate(url, {
				state: {
					from: pathname,
				},
			})
		},
		[navigate, pathname]
	)
	const menuBtnRef = useRef()
	const [menuOpen, setMenuOpen] = useState(false)
	const handleClose = useCallback(() => {
		setMenuOpen(false)
	}, [])
	const handelOpen = useCallback(() => {
		setMenuOpen(true)
	}, [])
	const { user } = useAuth()

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
			<AppBar position="fixed" color="primary" variant="outlined" className={classes.appBar}>
				<Toolbar
					sx={{
						p: 2,
						justifyContent: 'space-between',
					}}>
					<img style={{ height: '40px' }} className={classes.img} src={projectHeroLogo} alt="project hero" />
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
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}>
				<div className={classes.drawerContainer}>
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
								key={index}
								onClick={() => {
									redirectTo(item.link)
								}}>
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
				</div>
			</Drawer>
			<main className={classes.content}>
				<Box
					sx={{
						p: 3,
						pb: 0,
					}}>
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
