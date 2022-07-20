import { HelpOutlineOutlined, QuestionMark, QuestionMarkOutlined } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const ConfirmationDialog = ({ content, open = false, cancel, confirm }) => {
    return (
        <Dialog maxWidth="xs" fullWidth open={open}>
            <DialogContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <HelpOutlineOutlined color="primary" fontSize="large" />
                <Typography align="left" variant="h5">
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    p: 4,
                }}
            >
                <Button size="large" variant="outlined" onClick={cancel}>
                    Cancel
                </Button>
                <Button size="large" variant="contained" onClick={confirm} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog
