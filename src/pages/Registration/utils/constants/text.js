export const ERROR_TEXT = {
    FIELD_REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email',
    INVALID_MOBILE_NUMBER: 'Please enter a valid mobile number',
    INVALID_OTP: 'Please enter a valid OTP',
    INVALID_PASSWORD: 'Please enter a valid password',
    INVALID_CONFIRM_PASSWORD: 'Please enter a valid confirm password',
    INVALID_NAME: 'Please enter a valid name',
    INVALID_PINCODE: 'Please enter a valid pincode',
    INVALID_DOB: 'Please enter a valid date of birth',
    INVALID_PAN: 'Please enter a valid PAN number',
    INVALID_UAN: 'Please enter a valid UAN number',
    INVALID_AADHAR: 'Please enter a valid Aadhar number',
    INVALID_BANK_ACCOUNT: 'Please enter a valid bank account number',
    CHECK_ERRORS: 'One or more fields are invalid',
}

const url = 'https://staging-api.projecthero.in'
const getBackendUrl = () => {
    //   if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    //     return process.env.REACT_APP_SERVER_URL_STAGING;
    //   }
    return url //process.env.REACT_APP_SERVER_URL;
}

export const BACKEND_URL = 'https://staging-api.projecthero.in' //getBackendUrl();

export const GET_STATES_URL = 'https://api.countrystatecity.in/v1/countries/IN/states'
