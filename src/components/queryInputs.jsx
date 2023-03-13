import { Button, Checkbox, Hidden, ListItemText, MenuItem, Select, TextField } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

export const QueryField = ({ name, validation, trim = true, ...rest }) => {
    const [sp, setSp] = useSearchParams()
    return (
        <TextField
            value={sp.get(name) ?? ''}
            onChange={(e) => {
                const nsp = new URLSearchParams(sp)
                if (validation) {
                    if (validation(e.target.value)) {
                        nsp.set(name, trim ? e.target.value.trim() : e.target.value)
                    }
                } else {
                    nsp.set(name, trim ? e.target.value.trim() : e.target.value)
                }
                if (e.target.value === '') {
                    nsp.delete(name)
                }
                nsp.delete('pageNumber')
                setSp(nsp, {
                    replace: true,
                })
            }}
            InputLabelProps={{ shrink: true }}
            {...rest}
        />
    )
}

export const QuerySelect = ({ name, validation, options, ...rest }) => {
    const [sp, setSp] = useSearchParams()
    return (
        <Select
            MenuProps={{
                sx: {
                    maxHeight: 800,
                },
            }}
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
            {options.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                    <ListItemText primary={item.label} />
                </MenuItem>
            ))}
        </Select>
    )
}

export const QueryMultiSelect = ({ name, validation, options = [], ...rest }) => {
    const [sp, setSp] = useSearchParams()
    const filterArr = sp.get(name)
    return (
        <Select
            MenuProps={{
                sx: {
                    maxHeight: 800,
                },
            }}
            renderValue={(selected) =>
                selected
                    .map((item) => {
                        const val = options?.find((opt) => opt.value === item)
                        return val?.label
                    })
                    .filter((item) => item)
                    .join(',')
            }
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
            {options.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                    <Checkbox className="a" checked={sp.get(name)?.split(',')?.indexOf(item.value) > -1} />
                    <ListItemText primary={item.label} />
                </MenuItem>
            ))}
        </Select>
    )
}
export const QueryReset = ({ children, except, ...props }) => {
    const [sp, setSp] = useSearchParams()

    return (
        <Button
            variant="outlined"
            color="error"
            onClick={() => {
                const nsp = new URLSearchParams()
                except?.map((item) => {
                    sp.get(item) && nsp.set(item, sp.get(item))
                })

                setSp(nsp, { replace: true })
            }}
            {...props}
        >
            {children}
        </Button>
    )
}
