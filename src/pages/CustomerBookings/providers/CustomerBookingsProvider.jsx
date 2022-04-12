import { createContext, useContext, useState } from 'react'
import { formatPhoneNumber, isANumber } from '../../../utils'
import { useGetCustomerBookings } from '../hooks/useGetCustomerBookings'

const BookingsContext = createContext(null)

export const CustomerBookingsProvider = ({ children }) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [validationError, setValidationError] = useState(null)
    const { isLoading, isSuccess, data, error, refetch } = useGetCustomerBookings(formatPhoneNumber(phoneNumber))

    const onPhoneNumberChange = (e) => {
        const value = e.target.value
        if (isANumber(value)) {
            setPhoneNumber(value)
        }
    }

    const onPhoneNumberSubmit = (e) => {
        e.preventDefault()
        setValidationError(null)
        if (phoneNumber.length < 10) {
            return setValidationError('Phone number must be 10 digits long')
        }
        refetch()
    }

    return (
        <BookingsContext.Provider
            value={{
                phoneNumber,
                onPhoneNumberChange,
                onPhoneNumberSubmit,
                validationError,
                isLoading,
                isSuccess,
                data,
                error,
            }}
        >
            {children}
        </BookingsContext.Provider>
    )
}

export const useCustomerBookings = () => useContext(BookingsContext)
