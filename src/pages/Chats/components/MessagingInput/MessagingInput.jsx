import React, { useCallback, useContext, useEffect } from 'react'
import { ImageDropzone } from 'react-file-utils'
import {
    AttachmentActions,
    AttachmentActionsContainer,
    AttachmentPreviewList,
    ChatAutoComplete,
    EmojiPicker,
    MessageInput,
    useChannelStateContext,
    useMessageInputContext,
    useMessageInputState,
} from 'stream-chat-react'

import { GiphyContext } from '../../Chats'
import { EmojiIcon, LightningBoltSmall, SendIcon } from '../../assets'

import { IconButton, Stack } from '@mui/material'
import './MessagingInput.css'
import { EmojiEmotionsOutlined, Group, Send } from '@mui/icons-material'
import { analytics } from '../../../../hooks/analytics'

const GiphyIcon = () => (
    <div className="giphy-icon__wrapper">
        <LightningBoltSmall />
        <p className="giphy-icon__text">GIPHY</p>
    </div>
)

const MessagingInput = () => {
    const { channel } = useChannelStateContext()
    const { giphyState, setGiphyState } = useContext(GiphyContext)
    const { acceptedFiles, maxNumberOfFiles, multipleUploads } = useChannelStateContext()

    const messageInput = useMessageInputContext()
    const onChange = useCallback(
        (event) => {
            const { value } = event.target
            const deletePressed = event.nativeEvent?.inputType === 'deleteContentBackward'

            if (messageInput.text.length === 1 && deletePressed) {
                setGiphyState(false)
            }

            if (!giphyState && messageInput.text.startsWith('/giphy') && !messageInput.numberOfUploads) {
                event.target.value = value.replace('/giphy', '')
                setGiphyState(true)
            }

            messageInput.handleChange(event)
        },
        [giphyState, messageInput.numberOfUploads, messageInput.text] // eslint-disable-line
    )
    const sendAnalytics = async () => {
        try {
            const users = (await channel.queryMembers({})).members
                .filter((user) => !user.is_moderator)
                .sort((a, b) => a.userType < b.userType)
            analytics.track('ChatMessageSend Pressed', {
                members: users.map((item) => ({
                    id: item.user?.id,
                    name: item.user?.name,
                    userType: item.user?.userType,
                })),
                groupType: users.map((item) => item.user?.userType).join('_'),
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Stack p={2} sx={{ borderTop: '1px solid #adb5bd', position: 'relative' }}>
            <ImageDropzone
                accept={acceptedFiles}
                handleFiles={messageInput.uploadNewFiles}
                multiple={multipleUploads}
                disabled={
                    (maxNumberOfFiles !== undefined && messageInput.numberOfUploads >= maxNumberOfFiles) || giphyState
                }
            >
                <AttachmentPreviewList />

                <Stack gap={2} direction={'row'} alignItems={'center'}>
                    <IconButton
                        color="primary"
                        onClick={messageInput.openEmojiPicker}
                        ref={messageInput.emojiPickerRef}
                    >
                        <EmojiEmotionsOutlined />
                    </IconButton>
                    <Stack direction={'row'} flex={1} alignItems={'center'}>
                        {giphyState && !messageInput.numberOfUploads && <GiphyIcon />}
                        <ChatAutoComplete
                            rows={2}
                            onChange={onChange}
                            handleSubmit={async (e) => {
                                sendAnalytics()
                                messageInput.handleSubmit(e)
                            }}
                            placeholder="Send a message"
                        />
                    </Stack>
                    <IconButton
                        color="primary"
                        aria-roledescription="button"
                        onClick={async (e) => {
                            sendAnalytics()
                            messageInput.handleSubmit(e)
                        }}
                    >
                        <Send />
                    </IconButton>
                </Stack>
                <EmojiPicker />
            </ImageDropzone>
        </Stack>
    )
}

export default React.memo(MessagingInput)
