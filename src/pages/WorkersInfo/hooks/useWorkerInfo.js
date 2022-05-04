import axios from 'axios'
import { format } from 'date-fns'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { isError } from '../../../utils/formErrorsChecker'

const SERVER_URL = getBackendUrl()

export const useWorkerInfo = () => {
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

            if (values.workerName) {
                sP.set('name', values.workerName)
            } else {
                sP.delete('name')
            }

            if (values.jobType !== 'none') {
                sP.set('jobType', values.jobType)
            } else {
                sP.delete('jobType')
            }

            if (values.phone) {
                sP.set('phoneNumber', values.phone)
            } else {
                sP.delete('phoneNumber')
            }

            // if ((values.state !== 'none') & (values.city != 'none')) {
            //     sP.set('city', values.city.toLowerCase())
            // } else {
            //     sP.delete('city')
            // }
            if (values.city != 'none') {
                sP.set('city', values.city.toLowerCase())
            } else {
                sP.delete('city')
            }
            if (values.state !== 'none') {
                sP.set('state', values.state.toLowerCase())
            } else {
                sP.delete('state')
            }
            if (values.createdAtDate !== null) {
                sP.set('createdAt', format(values.createdAtDate, 'dd/MM/yy'))
            } else {
                sP.delete('createdAt')
            }

            if (values.status !== 'none') {
                sP.set('status', values.status)
            } else {
                sP.delete('status')
            }
            if (values.skillType !== 'none') {
                sP.set('skillType', values.skillType)
            } else {
                sP.delete('skillType')
            }
            setSearchParams(sP, {
                replace: true,
            })
        },
        [searchParams]
    )
    const form = useFormik({
        initialValues: {
            workerName: '',
            status: 'none',
            city: 'none',
            state: 'none',
            phone: '',
            jobType: 'none',
            createdAtDate: null,
            skillType:'none',
        },
        validate: (values) => {},
        onSubmit: onSubmit,
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
        if (searchParams.get('createdAt')) {
            const dateArr = searchParams.get('createdAt').split('/').reverse()
            dateArr[0] = '20' + dateArr[0]
            form.setFieldValue('createdAtDate', new Date(dateArr.join('-')))
        }
        if (searchParams.get('status')) {
            form.setFieldValue('status', searchParams.get('status'))
        }
        if (searchParams.get('skillType')) {
            form.setFieldValue('skillType', searchParams.get('skillType'))
        }
        

        fetchWorkerData(searchParams)
    }, [searchParams])

    useEffect(() => {
        // const sp = new URLSearchParams(searchParams)
        // if (!sp.get('status')) {
        //     sp.set('status', 'REGISTERED')
        // }
        // setSearchParams(sp)
    }, [])

    const fetchWorkerData = useCallback(
        async (searchParams) => {
            setIsLoading(true)
            const sp = new URLSearchParams(searchParams)
            try {
                sp.set('pageSize', '100')
                Number(searchParams.get('pageNumber')) > 1
                    ? sp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                    : sp.delete('pageNumber')

                const { data, status } = await axios.get(`${SERVER_URL}/admin/workers?${sp.toString()}`)

                setResponse({
                    workerData: data.payload.response,
                    hasMore: data.payload.hasMore,
                })
            } catch (error) {
                showSnackbar({
                    msg: data.error,
                    sev: 'error',
                })
            }
            setIsLoading(false)
        },
        [searchParams]
    )

    const checkError = useCallback(
        (fieldName) => {
            return isError(fieldName, form)
        },
        [form, isError]
    )

    const downloadWorkersWithFilters = useCallback(async () => {
        setIsDownloading(true)
        try {
            const res = await axios.get(`${SERVER_URL}/admin/workers/download?` + searchParams.toString(), {
                responseType: 'blob',
            })

            const url = window.URL.createObjectURL(res.data)
            var a = document.createElement('a')
            a.href = url
            a.download = 'workers' + '.xlsx'
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
            checkError: checkError,
            response: response,
            isLoading: isLoading,
            downloadWorkersWithFilters: downloadWorkersWithFilters,
            isDownloading: isDownloading,
        }),
        [form, checkError, response, isLoading, downloadWorkersWithFilters, isDownloading]
    )
}
