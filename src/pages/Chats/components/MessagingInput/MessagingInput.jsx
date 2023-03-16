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
import { EmojiEmotionsOutlined, Send } from '@mui/icons-material'

const GiphyIcon = () => (
    <div className="giphy-icon__wrapper">
        <LightningBoltSmall />
        <p className="giphy-icon__text">GIPHY</p>
    </div>
)

const MessagingInput = () => {
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

    return (
        <Stack p={2} sx={{ borderTop: '1px solid #adb5bd' }}>
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
                        <ChatAutoComplete rows={2} onChange={onChange} placeholder="Send a message" />
                    </Stack>
                    <IconButton color="primary" aria-roledescription="button" onClick={messageInput.handleSubmit}>
                        <Send />
                    </IconButton>
                </Stack>
            </ImageDropzone>
            <EmojiPicker />
        </Stack>
    )
}

export default React.memo(MessagingInput)
