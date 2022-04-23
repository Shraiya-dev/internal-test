import axios from 'axios'
import { format, isBefore, isValid, parse } from 'date-fns'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()

const useEditAttendanceDialog = (data, onClose) => {
    const [sp, setSp] = useSearchParams()
    const { showSnackbar } = useSnackbar()

    const updateAttendance = async (values, fh) => {
        try {
            const res = await axios.put(`${SERVER_URL}/admin/attendance`, {
                projectId: data?.projectId,
                workerId: data?.workerId,
                date: sp.get('date'),
                attendanceType: 'clock_in',
                checkInTime: format(values.checkedInTime, 'hh:mm a'),
                checkOutTime: format(values.checkedOutTime, 'hh:mm a'),
            })
            showSnackbar({
                msg: 'Updated Attendance Successfully',
                sev: 'success',
            })
            fh.resetForm()
            onClose()
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }
    const [workerDetail, setWorkerDetail] = useState()
    const addAttendance = useCallback(
        async (values) => {
            try {
                const res = await axios.post(`${SERVER_URL}/admin/attendance`, {
                    workerId: workerDetail?.workerId,
                    date: sp.get('date'),
                    checkInTime: values.checkedInTime ? format(values.checkedInTime, 'hh:mm a').toLowerCase() : null,
                    checkOutTime: values.checkedOutTime ? format(values.checkedOutTime, 'hh:mm a').toLowerCase() : null,
                })
                showSnackbar({
                    msg: 'Updated Attendance Successfully',
                    sev: 'success',
                })
                fh.resetForm()
                onClose()
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        },
        [data, sp, workerDetail]
    )
    const searchWorkerForm = useFormik({
        initialValues: {
            phoneNumber: '',
        },
        validate: (values) => {},
        onSubmit: async (values) => {
            const urlParams = new URLSearchParams()
            urlParams.set('phoneNumber', values.phoneNumber)
            try {
                const { data, status } = await axios.get(`${SERVER_URL}/admin/workers?${urlParams.toString()}`)
                if (data.payload.response.length > 0) {
                    setWorkerDetail(data.payload.response[0])
                } else {
                    showSnackbar({
                        msg: 'No Worker found with given details',
                        sev: 'info',
                    })
                }
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        },
    })

    const deleteAttendance = useCallback(async () => {
        try {
            const payload = {
                projectId: data?.projectId,
                workerId: data?.workerId,
                date: sp.get('date'),
            }
            const res = await axios.post(`${SERVER_URL}/admin/attendance/leave`, payload)
            showSnackbar({
                msg: 'Delete Attendance Successfully',
                sev: 'success',
            })
            fh.resetForm()
            onClose()
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [data, sp])
    const validate = useCallback(
        (values) => {
            const errors = {}
            if (!data && values.checkedOutTime - new Date() > 0) {
                errors.checkedOutTime = 'Check out time cannot be of future'
            }
            if (!data && values.checkedInTime - new Date() > 0) {
                errors.checkedInTime = 'Check out time cannot be of future'
            }
            if (!values.checkedInTime) {
                errors.checkedInTime = 'Invalid check in time'
            }
            if (!isValid(values.checkedInTime)) {
                errors.checkedInTime = 'Invalid check in time'
            }
            if (data && !values.checkedOutTime) {
                errors.checkedOutTime = 'Invalid check out time'
            }
            if (data && values.checkedOutTime && !isValid(values.checkedOutTime)) {
                errors.checkedOutTime = 'Invalid check out time'
            }
            if (values.checkedOutTime && values.checkedInTime && values.checkedOutTime - values.checkedInTime < 0) {
                errors.checkedOutTime = 'Check out time Cannot be before check in time'
            }
            return errors
        },
        [data]
    )
    const form = useFormik({
        initialValues: {
            phoneNumber: '',
            checkedInTime: null,
            checkedOutTime: null,
        },
        validate: validate,
        onSubmit: (v, fh) => {
            if (data) {
                updateAttendance(v, fh)
            } else {
                addAttendance(v, fh)
            }
        },
    })

    useEffect(() => {
        if (!data) return
        data?.checkIn
            ? form.setFieldValue('checkedInTime', parse(data.checkIn, 'hh:mm a', new Date()))
            : form.setFieldValue('checkedInTime', null)
        data?.checkOut
            ? form.setFieldValue('checkedOutTime', parse(data.checkOut, 'hh:mm a', new Date()))
            : form.setFieldValue('checkedOutTime', null)
    }, [data])

    const isError = useCallback(
        (name) => {
            const touched = form.touched
            const errors = form.errors
            return touched[name] && errors[name] ? errors[name] : null
        },
        [form]
    )

    return useMemo(
        () => ({
            form: form,
            workerDetail: workerDetail,
            searchWorkerForm: searchWorkerForm,
            setWorkerDetail: setWorkerDetail,
            isError: isError,
            deleteAttendance: deleteAttendance,
        }),
        [form, workerDetail, searchWorkerForm, setWorkerDetail, isError, deleteAttendance]
    )
}

export default useEditAttendanceDialog
