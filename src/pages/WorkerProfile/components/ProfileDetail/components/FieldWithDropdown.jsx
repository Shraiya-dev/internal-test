import { Box, Typography, FormControl, Select, MenuItem } from '@material-ui/core'
import { useWorkerProfile } from '../../../providers/WorkerProfileProvider/WorkerProfileProvider'

const vaccination = ['vaccinationStatus', 'urlLink']

export const FieldWithDropdown = ({ fieldName, value, name, dropDownList }) => {
    const { editMode, dispatchEditWorkerState, fieldNameToActionType, editWorkerState } = useWorkerProfile()

    const onFieldChange = (e) =>
        dispatchEditWorkerState({
            type: fieldNameToActionType(name),
            payload: e.target.value,
        })

    let fieldValue = ''

    if (editWorkerState && vaccination.includes(name)) {
        const vaccination = editWorkerState?.vaccination
        if (name === 'vaccinationStatus') {
            fieldValue = vaccination?.status
        } else {
            fieldValue = vaccination[name]
        }
    }

    if (editWorkerState && !vaccination.includes(name)) {
        fieldValue = editWorkerState[name]
    }

    return (
        <Box pt={1} pb={1}>
            <Typography color="textSecondary" style={{ fontSize: '0.9rem' }}>
                {fieldName}
            </Typography>
            {editMode ? (
                <FormControl>
                    <Select
                        labelId="edit-worker-detail-dropdown"
                        id="worker-detail-dropdown"
                        value={fieldValue}
                        onChange={onFieldChange}
                    >
                        {dropDownList?.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Typography style={{ fontWeight: '600' }}>{value}</Typography>
            )}
        </Box>
    )
}
