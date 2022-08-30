export const checkError = (name, form) => {
    const touched = form.touched
    const errors = form.errors
    return touched[name] && errors[name] ? errors[name] : null
}
export const isPinCodeValid = (pincode) => {
    return /^[1-9][0-9]{5}$/.test(pincode)
}

export const validateRegex = (regEx, value) => {
    return regEx.test(value)
}
