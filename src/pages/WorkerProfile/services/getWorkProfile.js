import axios from 'axios'
import { getWorkProfileAPI } from '../../../api'

export const getWorkProfile = async (workerId, bookingId) => await axios.get(getWorkProfileAPI(workerId, bookingId))
