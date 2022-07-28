import {
    Box,
    CircularProgress,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import { useGSTINModal } from '../pages/Organization/hooks/useGSTINModal'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useState } from 'react'

const initialGstData = [
    {
        key: 'tradeNam',
        name: 'Trade Name',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'sts',
        name: 'Status',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'pradr',
        name: 'Present Business Address',
        subKey: 'adr',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'ctb',
        name: 'Constitution of Business',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'bzgddtls',
        name: 'HSN details for Goods',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'aggreTurnOver',
        name: 'Aggregated Annual Turnover Slab',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'aggreTurnOverFY',
        name: 'aggreTurnOverFY',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'gti',
        name: 'Gross Total Income (Income-tax returns)',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
    {
        key: 'gtiFY',
        name: 'gtiFY',
        value: '',
        isCollapsibleData: false,
        collapsibleData: [],
        collapsibleDataKeys: [],
    },
]

export const GSTINModal = ({ modalHandler, openGSTINModal }) => {
    const { gstDetail, isLoading, networkMessage } = useGSTINModal({ openGSTINModal })
    const [collapseOpen, setCollapseOpen] = useState({ key: false })
    const [gstData, setGstData] = useState([...initialGstData])

    useEffect(() => {
        setGstData([
            ...initialGstData.map((val, index) => ({
                name: val.name,
                key: val.key,
                value: val.subKey ? gstDetail?.[val?.key]?.[val?.subKey] : gstDetail?.[val?.key],
                isCollapsibleData: gstDetail?.[val?.key] instanceof Object ? gstDetail?.[val?.key]?.length > 0 : false,
                collapsibleData: gstDetail?.[val?.key] instanceof Object ? gstDetail?.[val?.key] : [],
                collapsibleDataKeys:
                    gstDetail?.[val?.key]?.[0] instanceof Object ? Object.keys(gstDetail?.[val?.key]?.[0]) : [],
            })),
        ])
    }, [gstDetail])

    return (
        <Dialog fullWidth onClose={modalHandler} open={openGSTINModal?.open}>
            <Box
                sx={{
                    maxHeight: '710px',
                }}
            >
                <DialogTitle>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography>
                            {' '}
                            <span
                                style={{
                                    fontWeight: '700',
                                }}
                            >
                                GSTIN Detail :
                            </span>{' '}
                            {openGSTINModal?.GSTINid ?? '-'}
                        </Typography>
                        <IconButton onClick={modalHandler}>
                            <CancelIcon
                                sx={{
                                    color: 'primary.main',
                                }}
                            />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                {!isLoading ? (
                    <DialogContent>
                        <TableContainer>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>Key</TableCell>
                                        <TableCell sx={{ fontWeight: '900' }}>Details</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {gstData &&
                                        gstData?.map((val, index) => {
                                            return (
                                                <>
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ fontWeight: '900' }}>{val?.name}</TableCell>
                                                        <TableCell>
                                                            {!val?.value
                                                                ? '-'
                                                                : val?.value instanceof Object
                                                                ? 'Click to view Details'
                                                                : val?.value}{' '}
                                                        </TableCell>
                                                        <TableCell>
                                                            {!val?.value ? (
                                                                ''
                                                            ) : val?.value instanceof Object ? (
                                                                <IconButton
                                                                    aria-label="expand row"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        setCollapseOpen({
                                                                            ...collapseOpen,
                                                                            [val.name]: !collapseOpen[val.name],
                                                                        })
                                                                    }
                                                                >
                                                                    {!collapseOpen[val?.name] ? (
                                                                        <KeyboardArrowDownIcon />
                                                                    ) : (
                                                                        <KeyboardArrowUpIcon />
                                                                    )}
                                                                </IconButton>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    {val?.isCollapsibleData && (
                                                        <TableRow sx={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                            <TableCell
                                                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                                                colSpan={6}
                                                            >
                                                                <Collapse
                                                                    in={collapseOpen[val?.name]}
                                                                    timeout="auto"
                                                                    unmountOnExit
                                                                >
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            {Object?.keys(val?.collapsibleData[0])?.map(
                                                                                (x) => {
                                                                                    return (
                                                                                        <TableCell
                                                                                            sx={{
                                                                                                fontWeight: '900',
                                                                                            }}
                                                                                        >
                                                                                            {x}
                                                                                        </TableCell>
                                                                                    )
                                                                                }
                                                                            )}
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {val?.collapsibleData?.map((x, idx) => {
                                                                            return (
                                                                                <TableRow>
                                                                                    {val?.collapsibleDataKeys?.map(
                                                                                        (data, index) => {
                                                                                            return (
                                                                                                <TableCell key={index}>
                                                                                                    {x?.[data] ?? '-'}
                                                                                                </TableCell>
                                                                                            )
                                                                                        }
                                                                                    )}
                                                                                </TableRow>
                                                                            )
                                                                        })}
                                                                    </TableBody>
                                                                </Collapse>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            )
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                ) : (
                    <DialogContent
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {!networkMessage.length > 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography color="red">{networkMessage}</Typography>
                        )}
                    </DialogContent>
                )}
            </Box>
        </Dialog>
    )
}
