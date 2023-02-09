import { Button, debounce, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { ADD_PROJECT_ROUTE } from '../../../routes'
import { validateEmail } from '../../../utils/optionHelpers'
const SERVER_URL = getBackendUrl()

export const useCustomer = () => {
    const [customers, setCustomers] = useState([])
    const [hasMore, setHasMore] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const { showSnackbar } = useSnackbar()
    const [editOrgCustomerProps, setEditOrgCustomerProps] = useState({
        open: false,
    })
    const getCustomer = useCallback(
        debounce(async (searchParams) => {
            if (searchParams.get('customerPhone') && searchParams.get('customerPhone').length !== 10) return
            if (searchParams.get('customerEmail') && !validateEmail(searchParams.get('customerEmail'))) return

            setIsLoading(true)
            try {
                const sp = new URLSearchParams(searchParams)
                if (searchParams.get('pageNumber')) {
                    sp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                }
                if (searchParams.get('customerPhone')) {
                    sp.set('customerPhone', '+91' + searchParams.get('customerPhone'))
                }
                sp.set('pageSize', 20)
                const { status, data } = await axios.get(`${SERVER_URL}/gateway/admin-api/customers?${sp}`)
                setCustomers(data.payload.customers.map((item) => ({ ...item.customer, ...item.organisation })))
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
        getCustomer(searchParams)
    }, [searchParams])

    // dataGrid column
    const columns = useMemo(
        () => [
            {
                field: 'name',
                headerName: 'Name',
                sortable: true,
                renderCell: (params) => (
                    <Link to={`/customers/${params?.row?.customerId}`}>
                        <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                            {params?.row?.name ?? 'No Name'}
                        </Typography>
                    </Link>
                ),
                width: 180,
            },
            {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                sortable: true,
                width: 150,
            },
            {
                field: 'email',
                headerName: 'Email',
                sortable: true,
                width: 250,
            },
            {
                field: 'onboardingStatus',
                headerName: 'Status',
                sortable: true,
                width: 250,
            },
            {
                field: 'createdAt',
                headerName: 'Created At',
                sortable: true,
                width: 180,
            },
            {
                field: 'organisationId',
                headerName: 'Organisation Id',
                sortable: true,
                renderCell: (params) => (
                    <Link to={`/organization?organisationId=${params?.row?.organisationId}`}>
                        <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                            {params?.row?.organisationId}
                        </Typography>
                    </Link>
                ),
                width: 180,
            },
            {
                field: 'gstin',
                headerName: 'GSTIN',
                sortable: true,
                width: 180,
                valueGetter: (params) => {
                    return params?.row?.GSTIN
                },
            },
            {
                field: 'role',
                headerName: 'Role',
                sortable: true,
                width: 180,
                valueGetter: (params) => {
                    return params?.row?.linkedOrganisation?.role
                },
            },
            {
                field: 'isDeleted',
                headerName: 'Deleted',
                sortable: true,
                width: 70,
                valueGetter: (params) => {
                    return params?.row?.linkedOrganisation?.isDeleted
                },
            },
            {
                field: 'projects',
                headerName: 'Projects',
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Link to={`/projects?organisationId=${params?.row?.linkedOrganisation?.organisationId}`}>
                            <Button variant="outlined">View Projects </Button>
                        </Link>
                        {params?.row?.linkedOrganisation?.organisationId && (
                            <Link
                                to={`/organisation/${params?.row?.linkedOrganisation?.organisationId}/customer/${params?.row?.customerId}/project/create`}
                            >
                                <Button variant="outlined">Create Project </Button>
                            </Link>
                        )}
                    </Stack>
                ),
                sortable: true,
                width: 400,
            },
            {
                field: 'addProjects',
                headerName: 'AddProjects',
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Link to={`/projects/create/${params?.row?.customerId}`}>
                            <Button variant="outlined">Create Project </Button>
                        </Link>
                    </Stack>
                ),
                sortable: true,
                width: 400,
            },
            {
                field: 'bookings',
                headerName: 'Bookings',
                renderCell: (params) => (
                    <Link
                        to={
                            params?.row?.linkedOrganisation?.organisationId
                                ? `/bookings?organisationId=${params?.row?.linkedOrganisation?.organisationId}`
                                : `/bookings?customerPhone=${params?.row?.phoneNumber}`
                        }
                    >
                        <Button variant="outlined"> View Bookings </Button>
                    </Link>
                ),
                sortable: true,
                width: 220,
            },
            {
                field: 'EditMember',
                headerName: 'Edit Member',
                renderCell: (params) => (
                    <Button
                        onClick={() => {
                            setEditOrgCustomerProps({
                                open: true,
                                onClose: () => {
                                    getCustomer(searchParams)
                                    setEditOrgCustomerProps({
                                        open: false,
                                    })
                                },
                                data: params?.row,
                            })
                        }}
                        variant="outlined"
                    >
                        Edit Member
                    </Button>
                ),
                width: 220,
            },
        ],
        [searchParams, getCustomer]
    )

    return useMemo(
        () => ({
            columns,
            customers,
            hasMore,
            isLoading,
            getCustomer,
            editOrgCustomerProps,
        }),
        [columns, customers, hasMore, isLoading, getCustomer, editOrgCustomerProps]
    )
}
