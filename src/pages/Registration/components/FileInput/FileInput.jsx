import React from 'react'

// MUI components
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { FormHelperText } from '@mui/material'
import { ERROR_TEXT } from '../../utils/constants/text'

const useStyles = makeStyles({
    heading: {
        margin: '0 0 24px 0',
        fontSize: '1.2rem',
        color: '#0d0c22',
        fontWeight: 900,
    },
    subHeading: {
        fontSize: '0.8rem',
        color: '#0d0c22',
        fontWeight: 900,
    },
    image: {
        width: 'auto',
        height: 200,
        maxWidth: '100%',
    },
    fileUpload: {
        width: '95%',
        '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-Focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #e2e2e1 !important',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #e2e2e1',
            overflow: 'hidden',
            borderRadius: 3,
        },
    },
})

const FileInput = ({ name = '', heading = '', error = '', value = null, src, onChange }) => {
    const classes = useStyles()
    return (
        <>
            <p className={classes.heading}>{heading}</p>
            <TextField
                type="file"
                name={name}
                className={classes.fileUpload}
                inputProps={{
                    accept: 'image/*',
                }}
                onChange={onChange}
            />
            {value && (
                <>
                    <p className={classes.subHeading}>Preview</p>
                    <img src={src} alt="preview" className={classes.image} />
                </>
            )}
            {error && (
                <FormHelperText error={error} id="outlined-weight-helper-text">
                    {ERROR_TEXT.FIELD_REQUIRED}
                </FormHelperText>
            )}
        </>
    )
}

export default FileInput
