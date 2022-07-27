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
import React from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import { useGSTINModal } from '../pages/Organization/hooks/useGSTINModal'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useState } from 'react'

export const GSTINModal = ({ modalHandler, openGSTINModal }) => {
    const { gstDetail, isLoading } = useGSTINModal({ openGSTINModal })
    const [collapseOpen, setCollapseOpen] = useState(false)
    return (
        <Dialog fullWidth onClose={modalHandler} open={openGSTINModal?.open}>
            <Box>
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
                                        <TableCell sx={{ fontWeight: '900' }}>TradeNam</TableCell>
                                        <TableCell>{gstDetail?.tradeNam ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>sts</TableCell>
                                        <TableCell>{gstDetail?.sts ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>pradr.adr</TableCell>
                                        <TableCell>{gstDetail?.pradr?.adr ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>ctb</TableCell>
                                        <TableCell>{gstDetail?.ctb ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>bzgddtls</TableCell>
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
                                                    {gstDetail?.bzgddtls instanceof Object ? (
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
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                                                {/* <Typography variant="h6" gutterBottom component="div">
                                                    bzgddtls
                                                </Typography> */}
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: '900' }}>gdes</TableCell>
                                                        <TableCell sx={{ fontWeight: '900' }}>hsncd</TableCell>
                                                        <TableCell sx={{ fontWeight: '900' }} align="right">
                                                            industry
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: '900' }} align="right">
                                                            subIndustry
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {gstDetail?.bzgddtls?.map((val, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{val?.gdes}</TableCell>
                                                                <TableCell>{val?.hsncd}</TableCell>
                                                                <TableCell>{val?.industry} </TableCell>
                                                                <TableCell>{val?.subIndustry} </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>aggreTurnOver</TableCell>
                                        <TableCell>{gstDetail?.aggreTurnOver ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>aggreTurnOverFY</TableCell>
                                        <TableCell>{gstDetail?.aggreTurnOverFY ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>gti</TableCell>
                                        <TableCell>{gstDetail?.gti ?? '-'}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '900' }}>gtiFY</TableCell>
                                        <TableCell>{gstDetail?.gtiFY ?? '-'}</TableCell>
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
                        <CircularProgress />
                    </DialogContent>
                )}
            </Box>
        </Dialog>
    )
}
