import axios from 'axios'
import { format } from 'date-fns'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'

const SERVER_URL = getBackendUrl()

const useAttendance = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [response, setResponse] = useState({
        hasMore: false,
        workerData: [],
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const { showSnackbar } = useSnackbar()

    const onSubmit = useCallback(
        async (values) => {
            const sP = new URLSearchParams(searchParams)

            if (values.bookingId !== '') {
                sP.set('bookingId', values.bookingId)
            } else {
                sP.delete('bookingId')
            }
            if (values.customerPhoneNumber !== '') {
                sP.set('customerPhoneNumber', values.customerPhoneNumber)
            } else {
                sP.delete('customerPhoneNumber')
            }
            if (values.workerPhoneNumber !== '') {
                sP.set('workerPhoneNumber', values.workerPhoneNumber)
            } else {
                sP.delete('workerPhoneNumber')
            }

            if (values.date !== '') {
                sP.set('date', format(values.date, 'dd/MM/yy'))
            } else {
                sP.set('date', format(new Date(), 'dd/MM/yy'))
            }

            setSearchParams(sP, {
                replace: true,
            })
        },
        [searchParams]
    )

    useEffect(() => {
        if (searchParams.get('customerPhoneNumber')) {
            form.setFieldValue('customerPhoneNumber', searchParams.get('customerPhoneNumber'))
        }
        if (searchParams.get('workerPhoneNumber')) {
            form.setFieldValue('workerPhoneNumber', searchParams.get('workerPhoneNumber'))
        }
        if (searchParams.get('bookingId')) {
            form.setFieldValue('bookingId', searchParams.get('bookingId'))
        }

        if (searchParams.get('date')) {
            const dateArr = searchParams.get('date').split('/').reverse()
            dateArr[0] = '20' + dateArr[0]
            form.setFieldValue('date', new Date(dateArr.join('-')))
        }
        if (searchParams.get('date')) {
            fetchWorkerData(searchParams)
        }
    }, [searchParams])

    const fetchWorkerData = useCallback(async (searchParams) => {
        setIsLoading(true)
        const sp = new URLSearchParams(searchParams)
        try {
            sp.set('pageSize', '100')
            Number(searchParams.get('pageNumber')) > 1
                ? sp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                : sp.delete('pageNumber')
            const { data, status } = await axios.get(`${SERVER_URL}/admin/employee-history?${sp.toString()}`)

            setResponse({ workerData: data.payload.response, hasMore: data.payload.hasMore })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
            console.log(error)
        }
        setIsLoading(false)
    }, [])
    const refreshPage = useCallback(() => {
        fetchWorkerData(searchParams)
    }, [searchParams])

    const form = useFormik({
        initialValues: {
            date: new Date(),
            bookingId: '',
            customerPhoneNumber: '',
            workerPhoneNumber: '',
            checkedIn: false,
            checkedOut: false,
            earningGenerated: false,
        },
        validate: (values) => {
            const errors = {}
            // if (values.phone.length > 0 || values.phone.length < 10) {
            // 	errors.phone = 'Invalid Phone Number'
            // }
            return errors
        },
        onSubmit: onSubmit,
    })

    useEffect(() => {
        const sp = new URLSearchParams(searchParams)
        if (!sp.get('date')) {
            sp.set('date', format(new Date(), 'dd/MM/yy'))
        }
        setSearchParams(sp)
    }, [])

    const downloadEmployeeHistoryWithFilters = useCallback(async () => {
        setIsDownloading(true)
        try {
            const res = await axios.get(`${SERVER_URL}/admin/employee-history/download?` + searchParams.toString(), {
                responseType: 'blob',
            })

            const url = window.URL.createObjectURL(res.data)
            var a = document.createElement('a')
            a.href = url
            a.download = searchParams.get('date') + '.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
            showSnackbar({
                msg: 'Download Complete',
                sev: 'success',
            })
            setIsDownloading(false)
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
            setIsDownloading(false)
        }
    }, [searchParams])
    return useMemo(
        () => ({
            form: form,
            response: response,
            isLoading: isLoading,
            downloadEmployeeHistoryWithFilters: downloadEmployeeHistoryWithFilters,
            isDownloading: isDownloading,
            refreshPage: refreshPage,
        }),
        [form, response, isLoading, downloadEmployeeHistoryWithFilters, isDownloading, refreshPage]
    )
}

export default useAttendance
