import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StreamChat } from 'stream-chat'
import { Channel, ChannelList, Chat } from 'stream-chat-react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { envs } from '../../env'

import {
    CreateChannel,
    CustomMessage,
    MessagingChannelList,
    MessagingChannelPreview,
    MessagingInput,
} from './components'

import { ChannelInner } from './components/ChannelInner/ChannelInner'

import { EmojiEmotions } from '@mui/icons-material'
import { Stack, Switch, TextField, alpha, debounce, styled } from '@mui/material'
import 'stream-chat-react/dist/css/v2/index.css'
import '../../layout.css'
import { SearchUser } from '../../components/SearchFields'

const chatClient = new StreamChat(envs.CHAT_API_KEY)
const userToken = envs.CHAT_USER_TOKEN

chatClient.connectUser(
    {
        id: 'hr_manager_chat_user',
        name: 'Alisha (HR manager)',
        image: 'https://storage.googleapis.com/ph-assets/ic_hr_manager.png',
    },
    userToken
)
const initFilters = { type: 'messaging', members: { $in: ['hr_manager_chat_user'] } }
const initSort = { last_message_at: -1 }
const options = { state: true, watch: true, presence: true, limit: 15 }
export const GiphyContext = React.createContext({})

export const Chats = () => {
    const [filters, setFilters] = useState(initFilters)
    const [sort, setSort] = useState(initSort)

    const [giphyState, setGiphyState] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [theme, setTheme] = useState('light')
    useEffect(() => {
        const setAppHeight = () => {
            const doc = document.documentElement
            doc.style.setProperty('--app-height', `${window.innerHeight}px`)
        }
        setAppHeight()
        window.addEventListener('resize', setAppHeight)
        return () => window.removeEventListener('resize', setAppHeight)
    }, [])

    const giphyContextValue = { giphyState, setGiphyState }

    if (!chatClient) return null
    const searchUserWithPhoneNumber = useCallback(async (phoneNumber) => {
        const { users } = await chatClient.queryUsers(
            { phoneNumber: { $in: ['+91' + phoneNumber.replace('+91', '')] } },
            { last_active: -1 },
            { presence: true }
        )
        setFilters((p) => ({ ...p, members: { $in: [users?.[0]?.id] } }))
    }, [])
    const clearFilter = useCallback(() => {
        setFilters(initFilters)
    })
    const [check, setCheck] = useState(false)
    const handelSortToggle = useCallback((value) => {
        if (value) {
            setSort({
                unread_count: -1,
            })
        } else {
            setSort(initSort)
        }
    }, [])
    return (
        <DashboardLayout>
            <Chat client={chatClient} theme={`messaging ${theme}`}>
                <Stack direction={'row'} alignItems={'stretch'} height={'calc(100vh - 120px)'}>
                    <Stack>
                        <ChannelList
                            showChannelSearch
                            ChannelSearch={() => (
                                <>
                                    {/* <Switch
                                        value={check}
                                        onChange={(_, check) => {
                                            setCheck(check)
                                            handelSortToggle(check)
                                        }}
                                    /> */}
                                    <SearchUser onSearch={searchUserWithPhoneNumber} clearFilter={clearFilter} />
                                </>
                            )}
                            filters={filters}
                            setActiveChannelOnMount
                            sort={sort}
                            options={{ user_id: 'hr_manager_chat_user' }}
                            List={(props) => (
                                <MessagingChannelList
                                    {...props}
                                    handelSortToggle={handelSortToggle}
                                    onCreateChannel={() => setIsCreating(!isCreating)}
                                />
                            )}
                            Preview={(props) => <MessagingChannelPreview {...props} setIsCreating={setIsCreating} />}
                        />
                    </Stack>

                    <Stack flex={1}>
                        <Channel
                            Input={MessagingInput}
                            maxNumberOfFiles={10}
                            Message={(p) => <CustomMessage {...p} />}
                            multipleUploads={true}
                            TypingIndicator={() => null}
                        >
                            {isCreating && (
                                <CreateChannel toggleMobile={() => {}} onClose={() => setIsCreating(false)} />
                            )}
                            <GiphyContext.Provider value={giphyContextValue}>
                                <ChannelInner theme={theme} toggleMobile={() => {}} />
                            </GiphyContext.Provider>
                        </Channel>
                    </Stack>
                </Stack>
            </Chat>
        </DashboardLayout>
    )
}
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))
