import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { Layout } from '../../components'
import { SearchCustomer } from './components/SearchCustomer'
import { CustomerBookingsProvider } from './providers/CustomerBookingsProvider'
import { Bookings } from './components/Bookings'
import { useNavigate } from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
	header: {
		borderBottom: 'solid 1px #E5E7EB',
		backgroundColor: '#ffffff',
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			padding: theme.spacing(2),
		},
	},
	searchContainer: {
		width: '100%',
		margin: 'auto',
		[theme.breakpoints.up('md')]: {
			width: '40%',
		},
	},
	container: {
		minHeight: '100%',
	},
}))

export const CustomerBookings = () => {
	const navigate = useNavigate()
	useEffect(() => {
		navigate('/bookings')
	}, [navigate])

	const classes = useStyles()
	return (
		<CustomerBookingsProvider>
			<section className={classes.header}>
				<Layout>
					<article className={classes.searchContainer}>
						<SearchCustomer />
					</article>
				</Layout>
			</section>
			<section className={classes.container}>
				<Layout>
					<Bookings />
				</Layout>
			</section>
		</CustomerBookingsProvider>
	)
}
