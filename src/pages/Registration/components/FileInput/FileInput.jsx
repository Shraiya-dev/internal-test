import { Button, styled, Box } from '@mui/material'

import { useRef } from 'react'

const CustomPaper = styled(Box)(({ theme }) => ({
    '.fileInputContainer': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '.hide': {
        visibility: 'hidden',
        width: 0,
        height: 0,
    },
    '.labelStyle': {
        cursor: 'pointer',
    },
}))

export const FileInput = ({ ...props }) => {
    const labelRef = useRef()

    const { id, icon, label, disabled, variant, color, className, sx, ...inputProps } = props
    return (
        <CustomPaper flex={1}>
            <Button
                sx={sx}
                disabled={disabled}
                onClick={() => {
                    labelRef.current.click()
                }}
                // startIcon={icon}
                variant={variant}
                color={color}
                style={{
                    border: '1px dashed rgba(6, 31, 72, 0.5)',
                    borderRadius: 8,
                    padding: 20,
                    width: '100%',
                    height: '100%',
                }}
            >
                {icon}
                <label className={'hide'} ref={labelRef} htmlFor={id}></label>
                <input className={'hide'} id={id} type="file" {...inputProps} />
            </Button>
        </CustomPaper>
    )
}
