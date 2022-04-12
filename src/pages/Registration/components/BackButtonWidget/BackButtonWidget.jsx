import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import './BackButtonWidget.css'

const BackButtonWidget = () => {
    const navigate = useNavigate()
    const handleBackButtonClick = () => navigate(-1)
    return (
        <div className="back_button" onClick={handleBackButtonClick}>
            <ArrowBackIosIcon />
        </div>
    )
}

export default BackButtonWidget
