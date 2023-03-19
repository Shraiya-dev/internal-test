import { FilterList, FilterListOff, HighlightOffRounded } from '@mui/icons-material'
import { IconButton, InputAdornment, InputBase, Stack, TextField, alpha, styled } from '@mui/material'
import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Avatar, useChatContext } from 'stream-chat-react'
export const SearchUser = () => {
    const [sp, setSp] = useSearchParams()
    const ref = useRef(null)
    const { client } = useChatContext()
    const { id, image, name = 'No Name' } = client.user || {}
    return (
        <Stack gap={1} pb={1}>
            <Stack direction="row" alignItems={'center'} gap={1}>
                <Avatar
                    image={image ?? 'https://storage.googleapis.com/ph-assets/ic_hr_manager.png'}
                    name={name}
                    size={40}
                />
                <div>{name || id}</div>
            </Stack>
            <TextField
                ref={ref}
                sx={{
                    backgroundColor: '#fff',
                    maxWidth: '330px',
                    border: 'none',
                    px: 0.5,
                    borderRadius: 8,
                    input: {
                        padding: 0.5,
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            {sp.get('number') && (
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        sp.delete('number')
                                        setSp(new URLSearchParams(sp), {
                                            replace: true,
                                        })
                                    }}
                                >
                                    <HighlightOffRounded />
                                </IconButton>
                            )}
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    if (sp.get('unreadOnly')) {
                                        sp.delete('unreadOnly')
                                    } else {
                                        sp.set('unreadOnly', true)
                                    }
                                    setSp(new URLSearchParams(sp), {
                                        replace: true,
                                    })
                                }}
                            >
                                {sp.get('unreadOnly') ? <FilterListOff /> : <FilterList />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
                variant="standard"
                color="primary"
                value={sp.get('number') ?? ''}
                onChange={(e) => {
                    sp.set('number', e.target.value)
                    setSp(new URLSearchParams(sp), {
                        replace: true,
                    })
                }}
                placeholder="Search Number"
            />
            {/* <Search>
                <SearchIconWrapper>+91</SearchIconWrapper>
                <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search> */}
        </Stack>
    )
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}))
