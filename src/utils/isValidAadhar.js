export const isValidAadhar = (aadhar) => {
    const pattern = /^[2-9]{1}\d{11}$/gm
    return pattern.test(aadhar)
}
