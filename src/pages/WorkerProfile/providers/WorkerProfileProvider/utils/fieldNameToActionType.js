export const fieldNameToActionType = (fieldName) => {
    const fieldAndActions = {
        name: 'SET_NAME',
        gender: 'SET_GENDER',
        dob: 'SET_DOB',
        workerType: 'SET_WORKER_TYPE',
        accountNo: 'SET_ACCOUNT_NO',
        ifsc: 'SET_IFSC',
        bank: 'SET_BANK',
        aadhar: 'SET_AADHAR',
        uanNo: 'SET_UAN_NO',
        pan: 'SET_PAN',
        vaccinationStatus: 'SET_VACCINATION_STATUS',
    }

    const actionType = fieldAndActions[fieldName]

    if (actionType) {
        return actionType
    }

    throw new Error('Invalid field name for editing worker profile')
}
