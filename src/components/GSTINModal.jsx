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

export const GSTINModal = ({ modalHandler, openGSTINModal }) => {
    const { gstDetail, isLoading, networkMessage } = useGSTINModal({ openGSTINModal })
    const [collapseOpen, setCollapseOpen] = useState(false)

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
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>Trade Name</TableCell>
                                        <TableCell>{!gstDetail?.tradeNam ? '-' : gstDetail?.tradeNam} </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>Status</TableCell>
                                        <TableCell>{!gstDetail?.sts ? '-' : gstDetail?.sts}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}> Present Business Address</TableCell>
                                        <TableCell>{!gstDetail?.pradr?.adr ? '-' : gstDetail?.pradr?.adr}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>Constitution of Business</TableCell>
                                        <TableCell>{!gstDetail?.ctb ? '-' : gstDetail?.ctb}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>HSN details for Goods</TableCell>
                                        <TableCell>
                                            {gstDetail?.bzgddtls instanceof Object ? 'Click to view details' : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {gstDetail?.bzgddtls instanceof Object ? (
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => setCollapseOpen(!collapseOpen)}
                                                >
                                                    {!collapseOpen ? (
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
                                    <TableRow sx={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                        {gstDetail?.bzgddtls?.length > 0 && (
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: '900' }}>
                                                                Description
                                                            </TableCell>
                                                            <TableCell sx={{ fontWeight: '900' }}>HSN Code</TableCell>
                                                            <TableCell sx={{ fontWeight: '900' }}>Industry</TableCell>
                                                            <TableCell sx={{ fontWeight: '900' }}>
                                                                Sub-Industry
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {gstDetail?.bzgddtls?.map((val, index) => {
                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell>{val?.gdes ?? '-'}</TableCell>
                                                                    <TableCell>{val?.hsncd ?? '-'}</TableCell>
                                                                    <TableCell>{val?.industry ?? '-'} </TableCell>
                                                                    <TableCell>{val?.subIndustry ?? '-'} </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Collapse>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>
                                            Aggregated Annual Turnover Slab
                                        </TableCell>
                                        <TableCell>
                                            {!gstDetail?.aggreTurnOver ? '-' : gstDetail?.aggreTurnOver}
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>aggreTurnOverFY</TableCell>
                                        <TableCell>
                                            {!gstDetail?.aggreTurnOverFY ? '-' : gstDetail?.aggreTurnOverFY}
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>
                                            Gross Total Income (Income-tax returns)
                                        </TableCell>
                                        <TableCell>{!gstDetail?.gti ? '-' : gstDetail?.gti}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>gtiFY</TableCell>
                                        <TableCell>{!gstDetail?.gtiFY ? '-' : gstDetail?.gtiFY}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
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
