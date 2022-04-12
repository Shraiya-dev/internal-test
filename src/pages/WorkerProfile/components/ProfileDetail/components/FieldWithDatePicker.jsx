import { Box, Typography, TextField } from '@material-ui/core'
import { useWorkerProfile } from '../../../providers/WorkerProfileProvider/WorkerProfileProvider'

export const FieldWithDatePicker = ({ fieldName, value, name }) => {
    const { editMode, dispatchEditWorkerState, fieldNameToActionType, editWorkerState } = useWorkerProfile()

    const onFieldChange = (e) =>
        dispatchEditWorkerState({
            type: fieldNameToActionType(name),
            payload: e.target.value,
        })

    return (
        <Box pt={1} pb={1}>
            <Typography color="textSecondary" style={{ fontSize: '0.9rem' }}>
                {fieldName}
            </Typography>
            {editMode ? (
                <TextField type="date" onChange={onFieldChange} value={editWorkerState[name]} size="small" />
            ) : (
                <Typography style={{ fontWeight: '600' }}>{value}</Typography>
            )}
        </Box>
    )
}
