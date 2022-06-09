import { Button, debounce } from '@mui/material'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()

export const useOrganization = () => {
    const [organisation, setOrganisation] = useState([])
    const [hasMore, setHasMore] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const { showSnackbar } = useSnackbar()
    const [addOrgMemberProps, setAddOrgMemberProps] = useState({
        open: false,
        onClose: undefined,
        organisation: undefined,
    })

    const getOrganizations = useCallback(
        debounce(async (searchParams) => {
            setIsLoading(true)
            try {
                const sp = new URLSearchParams(searchParams)
                if (searchParams.get('pageNumber')) {
                    sp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                }
                sp.set('pageSize', 100)
                const { status, data } = await axios.get(
                    `${SERVER_URL}/gateway/admin-api/organisations?${sp.toString()}`
                )
                setOrganisation(data.payload.organisations.map((item) => ({ ...item.organisation })))
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
        getOrganizations(searchParams)
    }, [searchParams])

    // dataGrid column

    const columns = useMemo(
        () => [
            {
                field: 'organisationId',
                headerName: 'Organisation Id',
                sortable: true,
                width: 180,
            },
            {
                field: 'companyName',
                headerName: 'Company Name',
                sortable: true,
                width: 180,
            },

            {
                field: 'GSTIN',
                headerName: 'GSTIN',
                width: 200,
                editable: true,
            },
            {
                field: 'domain',
                headerName: 'Domain',
                sortable: true,
                width: 220,
            },
            {
                field: 'projects',
                headerName: 'Projects',
                renderCell: (params) => (
                    <Link to={`/projects?organisationId=${params.row.organisationId}`}>
                        <Button variant="outlined">View Projects </Button>
                    </Link>
                ),
                sortable: true,
                width: 220,
            },
            {
                field: 'bookings',
                headerName: 'Bookings',
                renderCell: (params) => (
                    <Link to={`/bookings?organisationId=${params.row.organisationId}`}>
                        <Button variant="outlined"> View Bookings </Button>
                    </Link>
                ),
                sortable: true,
                width: 220,
            },
            {
                field: 'customers',
                headerName: 'Customers',
                renderCell: (params) => (
                    <Link to={`/customers?organisationId=${params.row.organisationId}`}>
                        <Button variant="outlined">View Members</Button>
                    </Link>
                ),
                sortable: true,
                width: 220,
            },
            // {
            //     field: 'AddMember',
            //     headerName: 'Add Member',
            //     renderCell: (params) => (
            //         <Button
            //             onClick={() => {
            //                 setAddOrgMemberProps({
            //                     open: true,
            //                     onClose: () => {
            //                         getOrganizations(searchParams)
            //                         setAddOrgMemberProps({
            //                             open: false,
            //                         })
            //                     },
            //                     organisation: params?.row,
            //                 })
            //             }}
            //             variant="outlined"
            //         >
            //             Add Member
            //         </Button>
            //     ),
            //     sortable: true,
            //     width: 220,
            // },
        ],
        [searchParams, getOrganizations]
    )

    return useMemo(
        () => ({
            columns,
            organisation: organisation,
            hasMore,
            isLoading,
            addOrgMemberProps: addOrgMemberProps,
            getOrganizations: getOrganizations,
        }),
        [columns, organisation, hasMore, isLoading, getOrganizations, addOrgMemberProps]
    )
}
