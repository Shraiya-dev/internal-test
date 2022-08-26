import axios from 'axios'
import { format, isAfter, isBefore, isSameDay, isValid, parse } from 'date-fns'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
function isValidDate(d) {
    console.log(isValid(d))
    return isValid(d)
}

const Productivity = {
    BASE_OUTPUT: 'BASE_OUTPUT',
    MINIMUM_OUTPUT: 'MINIMUM_OUTPUT',
    TARGET_OUTPUT: 'TARGET_OUTPUT',
}

const useEditAttendanceDialog = (data, onClose, field) => {
    const [sp, setSp] = useSearchParams()
    const { showSnackbar } = useSnackbar()

    const dailyProductivityTypeValue = [
        { value: Productivity.BASE_OUTPUT, label: 'Base Output' },
        { value: Productivity.MINIMUM_OUTPUT, label: 'Minimum Output' },
        { value: Productivity.TARGET_OUTPUT, label: 'Target Output' },
    ]

    const updateAttendance = useCallback(
        async (values, fh) => {
            try {
                const res = await axios.put(`${SERVER_URL}/admin/attendance`, {
                    projectId: data?.projectId,
                    workerId: data?.workerId,
                    employeeId: data?.employeeId,
                    date: sp.get('date'),
                    attendanceType: 'clock_in',
                    checkInTime: values.checkedInTime ? format(values.checkedInTime, 'hh:mm a').toLowerCase() : null,
                    checkOutTime: values.checkedOutTime ? format(values.checkedOutTime, 'hh:mm a').toLowerCase() : null,
                    otCheckInTime: isValidDate(values.otCheckedInTime)
                        ? format(values.otCheckedInTime, 'hh:mm a').toLowerCase()
                        : null,
                    otCheckOutTime: isValidDate(values.otCheckedOutTime)
                        ? format(values.otCheckedOutTime, 'hh:mm a').toLowerCase()
                        : null,
                    dailyProductivityType: values.dailyProductivityType,
                })
                showSnackbar({
                    msg: 'Updated Attendance Successfully',
                    sev: 'success',
                })
                fh.resetForm()
                onClose()
            } catch (error) {
                console.log(error)
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        },
        [onClose]
    )

    const [workerDetail, setWorkerDetail] = useState()
    const addAttendance = useCallback(
        async (values, fh) => {
            try {
                const res = await axios.post(`${SERVER_URL}/admin/attendance`, {
                    workerId: workerDetail?.workerId,
                    employeeId: workerDetail?.employeeId,
                    date: sp.get('date'),
                    checkInTime: values.checkedInTime ? format(values.checkedInTime, 'hh:mm a').toLowerCase() : null,
                    checkOutTime: values.checkedOutTime ? format(values.checkedOutTime, 'hh:mm a').toLowerCase() : null,
                    otCheckInTime: isValidDate(values.otCheckedInTime)
                        ? format(values.otCheckedInTime, 'hh:mm a').toLowerCase()
                        : null,
                    otCheckOutTime: isValidDate(values.otCheckedOutTime)
                        ? format(values.otCheckedOutTime, 'hh:mm a').toLowerCase()
                        : null,
                    dailyProductivityType: values.dailyProductivityType,
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
        [data, sp, workerDetail, onClose]
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
                employeeId: data?.employeeId,
                workerId: data?.workerId,
                date: sp.get('date'),
            }
            const res = await axios.post(`${SERVER_URL}/admin/attendance/leave`, payload)
            showSnackbar({
                msg: 'Delete Attendance Successfully',
                sev: 'success',
            })
            onClose()
            // fh.resetForm()
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [data, sp, onClose])

    // delete OT functionality.
    const deleteOT = useCallback(async () => {
        try {
            const payload = {
                projectId: data?.projectId,
                employeeId: data?.employeeId,
                workerId: data?.workerId,
                date: sp.get('date'),
            }
            const res = await axios.post(`${SERVER_URL}/admin/attendance/delete-ot`, payload)
            showSnackbar({
                msg: 'Delete OT Successfully',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        onClose()
    }, [data, sp, onClose])

    const validate = useCallback(
        (values) => {
            console.log(values)

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
            console.log(
                new Date(),
                parse(sp.get('date'), 'dd/MM/yy', new Date()),
                isAfter(new Date(), parse(sp.get('date'), 'dd/MM/yy', new Date()))
            )
            if (data && !isAfter(new Date(), parse(sp.get('date'), 'dd/MM/yy', new Date())) && !values.checkedOutTime) {
                errors.checkedOutTime = 'Invalid check out time'
            }

            if (values.checkedOutTime && values.checkedInTime && values.checkedOutTime - values.checkedInTime < 0) {
                errors.checkedOutTime = 'Check out time Cannot be before check in time'
            }
            if (isSameDay(parse(sp.get('date'), 'dd/MM/yy', new Date()), new Date())) {
                if (values.checkedOutTime - new Date() > 0) {
                    errors.checkedOutTime = 'Check out time cannot be of future'
                }
                if (values.checkedInTime - new Date() > 0) {
                    errors.checkedInTime = 'Check out time cannot be of future'
                }
            }
            if (data && values.checkedOutTime && !isValid(values.checkedOutTime)) {
                errors.checkedOutTime = 'Invalid check out time'
            }

            // new validation

            // if (field === 'ot') {
            //     if (!data && values.otCheckedOutTime - new Date() > 0) {
            //         errors.otCheckedOutTime = 'OT Check out time cannot be of future'
            //     }
            //     if (!data && values.otCheckedInTime - new Date() > 0) {
            //         errors.otCheckedInTime = 'OT Check out time cannot be of future'
            //     }
            //     if (!values.otCheckedInTime) {
            //         errors.otCheckedInTime = 'Invalid OT check in time'
            //     }
            //     if (!isValid(values.otCheckedInTime)) {
            //         errors.otCheckedInTime = 'Invalid OT check in time'
            //     }
            //     console.log(
            //         new Date(),
            //         parse(sp.get('date'), 'dd/MM/yy', new Date()),
            //         isAfter(new Date(), parse(sp.get('date'), 'dd/MM/yy', new Date()))
            //     )
            //     if (
            //         data &&
            //         !isAfter(new Date(), parse(sp.get('date'), 'dd/MM/yy', new Date())) &&
            //         !values.otCheckedOutTime
            //     ) {
            //         errors.otCheckedOutTime = 'Invalid OT check out time'
            //     }

            //     if (
            //         values.otCheckedOutTime &&
            //         values.otCheckedInTime &&
            //         values.otCheckedOutTime - values.otCheckedInTime < 0
            //     ) {
            //         errors.otCheckedOutTime = 'OT Check out time Cannot be before check in time'
            //     }
            //     if (isSameDay(parse(sp.get('date'), 'dd/MM/yy', new Date()), new Date())) {
            //         if (values.otCheckedOutTime - new Date() > 0) {
            //             errors.otCheckedOutTime = 'OT Check out time cannot be of future'
            //         }
            //         if (values.otCheckedInTime - new Date() > 0) {
            //             errors.otCheckedInTime = 'OT Check out time cannot be of future'
            //         }
            //     }
            //     if (data && values.otCheckedOutTime && !isValid(values.otCheckedOutTime)) {
            //         errors.otCheckedOutTime = 'Invalid OT check out time'
            //     }
            // }
            return errors
        },
        [data, sp, field]
    )
    const onSubmit = useCallback(
        (v, fh) => {
            if (data) {
                updateAttendance(v, fh)
            } else {
                addAttendance(v, fh)
            }
        },
        [updateAttendance, addAttendance, data]
    )

    const form = useFormik({
        initialValues: {
            phoneNumber: '',
            checkedInTime: null,
            checkedOutTime: null,
            otCheckedOutTime: null,
            otCheckedInTime: null,
            dailyProductivityType: null,
        },
        validate: validate,
        onSubmit: onSubmit,
    })

    useEffect(() => {
        if (!data) return
        data?.checkIn
            ? form.setFieldValue('checkedInTime', parse(data.checkIn, 'hh:mm a', new Date()))
            : form.setFieldValue('checkedInTime', null)
        data?.checkOut
            ? form.setFieldValue('checkedOutTime', parse(data.checkOut, 'hh:mm a', new Date()))
            : form.setFieldValue('checkedOutTime', null)

        data?.otCheckInTime
            ? form.setFieldValue('otCheckedInTime', parse(data.otCheckInTime, 'hh:mm a', new Date()))
            : form.setFieldValue('otCheckedInTime', null)

        data?.otCheckOutTime
            ? form.setFieldValue('otCheckedOutTime', parse(data.otCheckOutTime, 'hh:mm a', new Date()))
            : form.setFieldValue('otCheckedOutTime', null)

        form.setFieldValue('dailyProductivityType', data?.dailyProductivityType ?? Productivity.BASE_OUTPUT)
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
            deleteOT: deleteOT,
            dailyProductivityTypeValue: dailyProductivityTypeValue,
        }),
        [
            form,
            workerDetail,
            searchWorkerForm,
            setWorkerDetail,
            isError,
            deleteAttendance,
            deleteOT,
            dailyProductivityTypeValue,
        ]
    )
}

export default useEditAttendanceDialog
