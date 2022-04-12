export const isValidBankAccount = (accountNo) => {
    const pattern = /^\d{9,18}$/gm
    return pattern.test(accountNo)
}
