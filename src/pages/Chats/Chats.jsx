import React, { useEffect, useMemo, useState } from 'react'
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
import { Stack } from '@mui/material'
import 'stream-chat-react/dist/css/v2/index.css'
import '../../layout.css'

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

const filters = { type: 'messaging', members: { $in: ['hr_manager_chat_user'] } }
const sort = { last_message_at: -1 }
const options = { state: true, watch: true, presence: true, limit: 15 }
export const GiphyContext = React.createContext({})

export const Chats = () => {
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
    const [activeChannels, setActiveChannels] = useState([])
    const getChannels = async () => {
        const c = await chatClient.queryChannels(filters, sort, options)
        console.log({ c })
        return c
    }
    useEffect(() => {
        if (!chatClient) return
        getChannels()
    }, [])

    if (!chatClient) return null
    return (
        <DashboardLayout>
            <Chat client={chatClient} theme={`messaging ${theme}`}>
                <Stack direction={'row'} alignItems={'stretch'} height={'calc(100vh - 120px)'}>
                    <Stack>
                        <ChannelList
                            filters={filters}
                            sort={sort}
                            options={options}
                            List={(props) => (
                                <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />
                            )}
                            Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
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
