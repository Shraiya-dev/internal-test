import { Upload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, InputAdornment, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useRef } from 'react'

const CustomButton = styled(LoadingButton)(({ theme }) => ({
    '.hide': {
        visibility: 'hidden',
        width: 0,
        height: 0,
    },
}))

export const FileInput = ({
    id,
    startIcon,
    isLoading,
    label,
    disabled,
    variant,
    color,
    className,
    sx,
    ...inputProps
}) => {
    const labelRef = useRef()
    return (
        <CustomButton
            sx={sx}
            disabled={disabled}
            onClick={() => {
                labelRef.current.click()
            }}
            startIcon={startIcon}
            loadingPosition="start"
            loading={isLoading}
            variant={variant}
            color={color}
        >
            {label}
            <label className={'hide'} ref={labelRef} htmlFor={id}></label>
            <input className={'hide'} id={id} type="file" {...inputProps} />
        </CustomButton>
    )
}

export const PhoneField = ({ onChange, ...rest }) => {
    return (
        <TextField
            type={'number'}
            InputProps={{
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
            }}
            {...rest}
            onChange={(e) => {
                if (!isNaN(Number(e.target.value)) && e.target.value.length <= 10 && onChange) {
                    onChange(e)
                }
            }}
        />
    )
}
