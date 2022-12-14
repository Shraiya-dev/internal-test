import { Button, InputLabel, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { getBackendUrl } from '../../api'
import { useSnackbar } from '../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
export const Membership = ({ uid, user, fetchWorker }) => {
    const { showSnackbar } = useSnackbar()

    const upgradeUserToGoldMembership = async (user) => {
        try {
            const { data } = await axios.post(`${SERVER_URL}/gateway/admin-api/workers/add-members`, {
                workerIds: [user.id],
                membershipType: 'GOLD',
            })
            if (data?.payload.successCount !== 0) {
                showSnackbar({
                    msg: `Worker Upgraded to GOLD Membership`,
                    sev: 'success',
                })
                fetchWorker()
            } else {
                showSnackbar({
                    msg: data?.payload.failedWorkers[0].message,
                    sev: 'error',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: `Failed to upgraded worker membership to GOLD`,
                sev: 'error',
            })
        }
    }

    return (
        <>
            <Stack p={2}>
                <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                    <h3>Membership Details</h3>
                    {user?.workerMembership?.type !== 'GOLD' && (
                        <Button variant="contained" onClick={() => upgradeUserToGoldMembership(user)}>
                            Mark As Gold
                        </Button>
                    )}
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Stack>
                        <InputLabel>type</InputLabel>
                        <Typography>{user?.workerMembership?.type ?? 'None'}</Typography>
                    </Stack>
                    <Stack>
                        <InputLabel>Updated on </InputLabel>
                        <Typography>{user?.workerMembership?.addedOn?.split('T')[0] ?? ''}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}
