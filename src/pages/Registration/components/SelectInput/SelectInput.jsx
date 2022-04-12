import React from 'react'

// MUI imports
import { makeStyles } from '@mui/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'

const useStyles = makeStyles({
    root: {
        '& .MuiOutlinedInput-input': {
            padding: '25px 32px 8px 12px !important',
        },
        '& .MuiOutlinedInput-root': {
            overflow: 'hidden',
            borderRadius: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
            },
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.7)',
            fontWeight: 600,
            transform: 'translate(12px, 16px) scale(1)',
            '&.Mui-focused': {
                color: 'rgba(0, 0, 0, 0.7)',
                transform: 'translate(12px, 7px) scale(0.75)',
            },
            '&.MuiFormLabel-filled': {
                color: 'rgba(0, 0, 0, 0.7)',
                transform: 'translate(12px, 7px) scale(0.75)',
            },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #e2e2e1 !important',
            '& span': {
                display: 'none',
            },
        },
    },
})

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
}

const SelectInput = ({
    extraStyle = {},
    label = '',
    value = '',
    handleChange = () => {},
    handleBlur = () => {},
    options = [],
    name = '',
    error = false,
    helperText = '',
    disabled = false,
}) => {
    const classes = useStyles()
    return (
        <FormControl className={classes.root} error={error} style={extraStyle} disabled={disabled}>
            <InputLabel id={label}>{label}</InputLabel>
            <Select
                labelId={label}
                id={label}
                value={value}
                name={name}
                label={label}
                onChange={handleChange}
                onBlur={handleBlur}
                MenuProps={MenuProps}
                disabled={disabled}
            >
                {options.map((option) => (
                    <MenuItem
                        value={name === 'state' || name === 'city' ? option.value.toLowerCase() : option.value}
                        key={option.value}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {helperText.length ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    )
}

export default SelectInput
