import { Button, Chip, Select, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useSearchParams } from 'react-router-dom'

export const QueryField = ({ name, validation, ...rest }) => {
    const [sp, setSp] = useSearchParams()
    return (
        <TextField
            value={sp.get(name) ?? ''}
            onChange={(e) => {
                const nsp = new URLSearchParams(sp)
                if (validation) {
                    if (validation(e.target.value)) {
                        nsp.set(name, e.target.value.trim())
                    }
                } else {
                    nsp.set(name, e.target.value.trim())
                }
                if (e.target.value === '') {
                    nsp.delete(name)
                }
                nsp.delete('pageNumber')
                setSp(nsp, {
                    replace: true,
                })
            }}
            {...rest}
        />
    )
}

export const QuerySelect = ({ name, validation, children, ...rest }) => {
    const [sp, setSp] = useSearchParams()
    return (
        <Select
            value={sp.get(name) ?? 'none'}
            onChange={(e) => {
                const nsp = new URLSearchParams(sp)
                if (validation) {
                    if (validation(e.target.value)) {
                        nsp.set(name, e.target.value)
                    }
                } else {
                    nsp.set(name, e.target.value)
                }
                if (e.target.value === 'none') {
                    nsp.delete(name)
                }
                nsp.delete('pageNumber')
                setSp(nsp, {
                    replace: true,
                })
            }}
            {...rest}
        >
            {children}
        </Select>
    )
}

export const QueryMultiSelect = ({ name, validation, children, ...rest }) => {
    const [sp, setSp] = useSearchParams()
    const filterArr = sp.get(name)
    return (
        <Select
            multiple
            value={filterArr?.split(',') ?? ['none']}
            onChange={(e) => {
                const valStr = e.target.value?.filter((item) => !(item === 'none' || item === ''))?.join(',')
                const nsp = new URLSearchParams(sp)
                if (validation) {
                    if (validation(e.target.value)) {
                        nsp.set(name, valStr)
                    }
                } else {
                    nsp.set(name, valStr)
                }
                if (valStr === '') {
                    nsp.delete(name)
                }
                nsp.delete('pageNumber')
                setSp(nsp, {
                    replace: true,
                })
            }}
            {...rest}
        >
            {children}
        </Select>
    )
}
export const QueryReset = ({ children, ...props }) => {
    const [sp, setSp] = useSearchParams()

    return (
        <Button
            variant="outlined"
            color="error"
            onClick={() => {
                setSp(new URLSearchParams())
            }}
            {...props}
        >
            {children}
        </Button>
    )
}
