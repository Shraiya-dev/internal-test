export const regexPatterns = {
    phoneNumber: /^[0-9]{10}$/,
    pincode: /^[0-9]{6}$/,
    aadhar: /^[2-9]{1}\d{11}$/,
    bankAccount: /^\d{9,18}$/,
    pan: /^[A-Z]{5}\d{4}[A-Z]{1}$/,
    uan: /^\d{12}$/,
    ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    isNum: /^\d*$/,
    alphabetsOrSpace: /^[a-zA-Z ]*$/,
    alphabets: /^[a-zA-Z]*$/,
    upiVpa: /^[\w.-]+@[\w.-]+$/,
    geoLocation: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
}
