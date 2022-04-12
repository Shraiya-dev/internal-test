import { Box, Typography, TextField } from '@material-ui/core'
import { useWorkerProfile } from '../../../providers/WorkerProfileProvider/WorkerProfileProvider'

const nestedFields = ['bank', 'accountNo', 'ifsc', 'aadhar', 'pan', 'uanNo']
const bankDetailsField = ['bank', 'accountNo', 'ifsc']
const docField = ['aadhar', 'pan', 'uanNo']

export const Field = ({ fieldName, value, name }) => {
    const { editMode, dispatchEditWorkerState, fieldNameToActionType, editWorkerState, workerProfileError } =
        useWorkerProfile()

    const onFieldChange = (e) =>
        dispatchEditWorkerState({
            type: fieldNameToActionType(name),
            payload: e.target.value,
        })

    let fieldValue

    if (editWorkerState && nestedFields.includes(name)) {
        if (bankDetailsField.includes(name)) {
            fieldValue = editWorkerState['bankDetails'][name] || ''
        }
        if (docField.includes(name)) {
            fieldValue = editWorkerState['doc'][name] || ''
        }
    }

    if (editWorkerState && !nestedFields.includes(name)) {
        fieldValue = editWorkerState[name] || ''
    }

    return (
        <Box pt={1} pb={1}>
            <Typography color="textSecondary" style={{ fontSize: '0.9rem' }}>
                {fieldName}
            </Typography>
            {editMode ? (
                <TextField
                    onChange={onFieldChange}
                    value={fieldValue}
                    size="small"
                    error={workerProfileError && workerProfileError[name] ? true : false}
                    helperText={workerProfileError && workerProfileError[name]}
                />
            ) : (
                <Typography style={{ fontWeight: '600' }}>{value}</Typography>
            )}
        </Box>
    )
}
