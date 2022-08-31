import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getBackendUrl } from '../api'
const SERVER_URL = getBackendUrl()
export const useLocationMetadata = () => {
    const [states, setStates] = useState([])
    const [districts, setDistricts] = useState([])
    const [stateId, setStateId] = useState(undefined)

    const getStates = useCallback(async () => {
        try {
            const { data } = await axios.get(`${SERVER_URL}/gateway/metadata/locations/states`)
            return setStates([...data?.payload?.states])
        } catch (error) {}
    }, [])
    const getDistricts = useCallback(
        async (stateValue) => {
            const state = states.find((item) => item.value === stateValue)

            try {
                const { data } = await axios.get(
                    `${SERVER_URL}/gateway/metadata/locations/states/${state.stateId}/districts`
                )
                setDistricts([...data.payload.districts])
            } catch (error) {}
        },
        [states]
    )
    useEffect(() => {
        getStates()
    }, [])
    useEffect(() => {
        if (stateId) {
            getDistricts(stateId)
        }
    }, [stateId])

    return { states, districts, setStateId }
}
9
