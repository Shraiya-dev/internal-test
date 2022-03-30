import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import axios from 'axios'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './providers'

const logout = () => {
	localStorage.removeItem('projectHeroInternalLogin')
	window.location.reload()
}

axios.interceptors.request.use(
	(config) => {
		const projectHeroInternalLogin = JSON.parse(localStorage.getItem('projectHeroInternalLogin'))
		const accessToken = projectHeroInternalLogin?.accessToken
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => {
		Promise.reject(error)
	}
)

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			return logout()
		}
		return Promise.reject(error)
	}
)

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<AuthProvider>
				<App />
			</AuthProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)
