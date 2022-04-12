export const isValidPAN = (panNo) => {
    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/gm
    return pattern.test(panNo)
}
