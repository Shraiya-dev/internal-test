import SearchIcon from '@mui/icons-material/Search'
import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { useState } from 'react'
export const SearchUser = ({ onSearch, clearFilter }) => {
    const [value, setValue] = useState()

    return (
        <Stack
            component="form"
            sx={{ maxWidth: '330px' }}
            onSubmit={(e) => {
                e.preventDefault()
                onSearch(value)
            }}
        >
            <TextField
                sx={{ backgroundColor: '#efefef' }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={() => onSearch(value)}>
                                <SearchIcon />
                            </IconButton>
                            <Button size="small" variant="outlined" color="error" onClick={() => clearFilter()}>
                                Clear
                            </Button>
                        </InputAdornment>
                    ),
                }}
                variant="filled"
                color="primary"
                value={value}
                label="Search User"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search…"
            />
        </Stack>
    )
}
