import { debounce, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { isError } from '../../../utils/formErrorsChecker'
const SERVER_URL = getBackendUrl()

export const useProject = () => {
    const [projects, setProjects] = useState([])
    const [hasMore, setHasMore] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const { showSnackbar } = useSnackbar()

    const getProjects = useCallback(
        debounce(async (searchParams) => {
            setIsLoading(true)
            try {
                const sp = new URLSearchParams(searchParams)
                if (searchParams.get('pageNumber')) {
                    sp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                }
                if (searchParams.get('customerPhone')) {
                    sp.set('customerPhone', '+91' + searchParams.get('customerPhone'))
                }
                sp.set('pageSize', 100)
                const { status, data } = await axios.get(`${SERVER_URL}/gateway/admin-api/projects?${sp.toString()}`)
                setProjects(data.payload.projects.map((item) => ({ ...item.project })))
                setHasMore(data.payload.hasMore)
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
            setIsLoading(false)
        }, 500),
        []
    )
    useEffect(() => {
        getProjects(searchParams)
    }, [searchParams])

    // dataGrid column

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
            renderCell: (params) => (
                <Link to={`/projects/${params?.id}`}>
                    <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                        {params?.row.name || 'No name'}
                    </Typography>
                </Link>
            ),
        },
        {
            field: 'siteAddress',
            headerName: 'Site Address',
            width: 250,
            editable: true,
        },
        {
            field: 'city',
            headerName: 'city',
            width: 150,
            editable: true,
        },
        {
            field: 'state',
            headerName: 'State',
            sortable: true,
            width: 150,
        },
        {
            field: 'activeEmployees',
            headerName: 'Active Employees',
            sortable: true,
            width: 250,
        },
    ]

    return useMemo(
        () => ({
            columns,
            projects,
            hasMore,
            isLoading,
            getProjects,
        }),
        [columns, projects, hasMore, isLoading, getProjects]
    )
}
