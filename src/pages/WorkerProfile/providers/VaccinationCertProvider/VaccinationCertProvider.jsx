import { createContext, useContext, useState, useEffect } from 'react'
import { useWorkerProfile } from '../WorkerProfileProvider/WorkerProfileProvider'
import { extractResponse } from '../../../../utils'

const VaccinationCertContext = createContext(null)

export const VaccinationCertProvider = ({ children }) => {
    const { isSuccess, data, editVaccinationCert, setEditVaccinationCert } = useWorkerProfile()
    const [operationPerformed, setOperationPerformed] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadedURL, setUploadedURL] = useState(null)

    const onSelectFile = (e) => {
        const file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e) => {
            setPreviewImage(reader.result)
        }
        setSelectedFile(file)
        setOperationPerformed(true)
    }

    const onRemovePictureClicked = () => {
        setPreviewImage(null)
        setOperationPerformed(true)
    }

    const onEditVaccinationCertClicked = () => setEditVaccinationCert(true)

    const onCancelClicked = () => {
        setEditVaccinationCert(false)
        setOperationPerformed(false)
    }

    const onCancelOperationClicked = () => {
        setEditVaccinationCert(true)
        setOperationPerformed(false)
    }

    const onOperationPerformed = () => setOperationPerformed(true)

    useEffect(() => {
        if (editVaccinationCert || isSuccess) {
            const res = extractResponse(data)
            if (res?.data) {
                return setPreviewImage(res?.data?.vaccination?.urlLink)
            }
            setPreviewImage(null)
        }
    }, [isSuccess, editVaccinationCert])

    return (
        <VaccinationCertContext.Provider
            value={{
                previewImage,
                editVaccinationCert,
                operationPerformed,
                onSelectFile,
                onRemovePictureClicked,
                onEditVaccinationCertClicked,
                onCancelClicked,
                onCancelOperationClicked,
                onOperationPerformed,
            }}
        >
            {children}
        </VaccinationCertContext.Provider>
    )
}

export const useVaccinationCert = () => useContext(VaccinationCertContext)
