import axios from 'axios'
import { useFormik } from 'formik'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { setupAuthHeaders } from '../../../providers/utils/setupAuthHeaders'
import { isError } from '../../../utils/formErrorsChecker'

const SERVER_URL = getBackendUrl()

export const useWorkerInfo = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const [workerData, setWorkerData] = useState([])
	const [sncBar, setSncBar] = useState({
		msg: '',
		sev: '',
	})

	const setSnackBar = useCallback(
		(props) => {
			setSncBar({
				msg: '',
			})
			setSncBar(props)
		},
		[setSncBar]
	)

	const form = useFormik({
		initialValues: {
			workerName: '',
			city: 'none',
			state: 'none',
			phone: '',
			jobType: 'none',
			// bookingStatus: 'none',
			// customerNumber: '',
		},
		validate: (values) => {
			const errors = {}
			// if (values.phone.length > 0 || values.phone.length < 10) {
			// 	errors.phone = 'Invalid Phone Number'
			// }
			return errors
		},
		onSubmit: async (values) => {
			const sP = new URLSearchParams()

			if (values.workerName) {
				sP.set('name', values.workerName)
			}

			if (values.jobType !== 'none') {
				sP.set('jobType', values.jobType)
			}

			if (values.phone) {
				sP.set('phoneNumber', values.phone)
			}

			if ((values.state !== 'none') & (values.city != 'none')) {
				sP.set('city', values.city.toLowerCase())
			}

			if (values.state !== 'none') {
				sP.set('state', values.state.toLowerCase())
			}

			setSearchParams(sP, {
				replace: true,
			})
		},
	})

	useEffect(() => {
		if (searchParams.get('phoneNumber')) {
			form.setFieldValue('phone', searchParams.get('phoneNumber'))
		}
		if (searchParams.get('city')) {
			form.setFieldValue('city', searchParams.get('city'))
		}
		if (searchParams.get('state')) {
			form.setFieldValue('state', searchParams.get('state'))
		}
		if (searchParams.get('jobType')) {
			form.setFieldValue('jobType', searchParams.get('jobType'))
		}
		if (searchParams.get('name')) {
			form.setFieldValue('workerName', searchParams.get('name'))
		}
		fetchWorkerData(searchParams)
	}, [searchParams])

	const fetchWorkerData = useCallback(
		async (searchParams) => {
			try {
				//todo add pagination here ask server to send total count of worker in response and calculate the number of pages using page size
				const { data, status } = await axios.get(
					`${SERVER_URL}/admin/workers?${searchParams}`

					// {params:{
					// 	jobType:searchParams.get('jobType') }}
				)
				setWorkerData(data.payload.response)
			} catch (error) {
				setSnackBar({
					msg: data.error,
					sev: 'error',
				})
			}
		},
		[searchParams]
	)

	const checkError = useCallback(
		(fieldName) => {
			return isError(fieldName, form)
		},
		[form, isError]
	)

	return useMemo(
		() => ({
			form: form,
			checkError: checkError,
			workerData: workerData,
		}),
		[form, checkError, workerData]
	)
}
