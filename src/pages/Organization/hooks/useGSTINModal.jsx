import { debounce } from '@mui/material'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useMemo } from 'react'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()

export const useGSTINModal = ({ openGSTINModal }) => {
    const [GSTId, setGSTId] = useState(openGSTINModal?.GSTINid)
    const { showSnackbar } = useSnackbar()
    const [gstDetail, setGstDetail] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const getData = async () => {
        try {
            if (GSTId !== undefined) {
                const { status, data } = await axios.get(`${SERVER_URL}/gateway/admin-api/organisations/gst/${GSTId}`)
                setGstDetail(data?.payload?.gstDetails ?? {})
                if (data !== {}) {
                    setIsLoading(false)
                }
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.messageToUser,
                sev: 'error',
            })
        }
    }

    useEffect(() => {
        getData()
    }, [GSTId])

    return useMemo(
        () => ({
            gstDetail,
            isLoading,
        }),
        [gstDetail, isLoading]
    )
}
