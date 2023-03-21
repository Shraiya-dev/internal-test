import { Face, LibraryBooks, Person, Redeem } from '@mui/icons-material'
import {
    AppBar,
    Box,
    Button,
    Dialog,
    Drawer,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import React, { useCallback, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import projectHeroLogo from '../../assets/brand-logo.svg'
import { VITE_PUBLIC_APP_ENV } from '../../env'
import * as Yup from 'yup'
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
    CHATS,
} from '../../routes'
import axios from 'axios'
import { useFormik } from 'formik'
import { useFormikProps } from '../../hooks/useFormikProps'
import { useSnackbar } from '../../providers/SnackbarProvider'
import { getBackendUrl } from '../../api'

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
    {
        label: 'Chats',
        icon: <Face />,
        link: CHATS,
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
export const SERVER_URL = getBackendUrl()

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
    const [addAdminModal, setAddAdminModal] = useState(false)
    const { showSnackbar } = useSnackbar()
    const form = useFormik({
        initialValues: {
            userName: '',
            phoneNumber: '',
        },
        onReset: () => {
            setAddAdminModal(false)
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('Name is required'),
            phoneNumber: Yup.string().required('Phone number is required').min(10, 'Enter a valid phone number'),
        }),
        onSubmit: async (values, fh) => {
            try {
                const { data } = await axios.post(`${SERVER_URL}/admin/ops-admin`, {
                    userName: values.userName,
                    phoneNumber: '+91' + values.phoneNumber,
                })
                if (data.success) {
                    showSnackbar({
                        sev: 'success',
                        msg: 'Successfully Created New Ops Admin',
                    })
                    fh.resetForm()
                } else {
                    showSnackbar({
                        sev: 'error',
                        msg: data?.error,
                    })
                }
            } catch (error) {
                showSnackbar({
                    sev: 'error',
                    msg: error?.response?.data?.developerInfo,
                })
            }
        },
    })

    const formikProps = useFormikProps(form)
    return (
        <>
            <Dialog open={addAdminModal}>
                <Stack p={2} gap={2}>
                    <Typography variant="h5" textAlign={'center'}>
                        Add New Ops Admin
                    </Typography>
                    <TextField label="User Name" {...formikProps('userName')} />
                    <TextField
                        label="Phone Number"
                        {...formikProps('phoneNumber')}
                        onChange={(e) => {
                            if (e.target.value.length <= 10) {
                                formikProps('phoneNumber').onChange(e)
                            }
                        }}
                    />

                    <Stack direction={'row'} gap={1}>
                        <Button fullWidth variant="outlined" color="error" onClick={form.handleReset}>
                            Cancel
                        </Button>
                        <Button fullWidth variant="contained" onClick={form.handleSubmit}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Dialog>
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
                        <MenuItem
                            onClick={() => {
                                setAddAdminModal(true)
                            }}
                        >
                            Add New Ops Admin
                        </MenuItem>

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
                            {item.label}
                        </ListItem>
                    ))}
                </List>
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
                    {children}
                </Box>
            </main>
        </>
    )
}

export default DashboardLayout
