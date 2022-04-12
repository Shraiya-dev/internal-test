import { useQuery } from 'react-query'
import { getProfilesFromStatus } from '../services/getProfilesFromStatus'

export const useGetProfiles = (bookingId, status) => {
    return useQuery('getProfilesFromHiringStatus', () => getProfilesFromStatus(bookingId, status))
}
