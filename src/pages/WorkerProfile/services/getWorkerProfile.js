import axios from 'axios'
import { getWorkerProfileAPI } from '../../../api'

export const getWorkerProfile = async (workerId, bookingId) => await axios.get(getWorkerProfileAPI(workerId, bookingId))
