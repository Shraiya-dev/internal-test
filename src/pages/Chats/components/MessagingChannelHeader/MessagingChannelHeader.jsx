import React, { useEffect, useRef, useState } from 'react'
import { Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react'
import './MessagingChannelHeader.css'
import { TypingIndicator } from '../TypingIndicator/TypingIndicator'
import { getCleanImage, HamburgerIcon } from '../../assets'
import { Link } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'

const getAvatarGroup = (members) => {
    if (members.length === 1) {
        return (
            <div className="messaging__channel-header__avatars">
                <Avatar image={getCleanImage(members[0])} name={members[0].user?.id} size={40} />;
            </div>
        )
    }

    if (members.length === 2) {
        return (
            <div className="messaging__channel-header__avatars two">
                <span>
                    <Avatar image={getCleanImage(members[0])} name={members[0].user?.id} shape="square" size={40} />
                </span>
                <span>
                    <Avatar image={getCleanImage(members[1])} name={members[1].user?.id} shape="square" size={40} />
                </span>
            </div>
        )
    }

    if (members.length === 3) {
        return (
            <div className="messaging__channel-header__avatars three">
                <span>
                    <Avatar image={getCleanImage(members[0])} name={members[0].user?.id} shape="square" size={40} />
                </span>
                <span>
                    <Avatar image={getCleanImage(members[1])} name={members[1].user?.id} shape="square" size={20} />
                    <Avatar image={getCleanImage(members[2])} name={members[2].user?.id} shape="square" size={20} />
                </span>
            </div>
        )
    }
    return null
}

const MessagingChannelHeader = (props) => {
    const { client } = useChatContext()
    const { channel } = useChannelStateContext()

    const [channelName, setChannelName] = useState(channel?.data.name || '')
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('')

    const inputRef = useRef()

    const members = Object.values(channel.state?.members || {}).filter((member) => member.user?.id !== client.user?.id)

    const updateChannel = async (e) => {
        if (e) e.preventDefault()

        if (channelName && channelName !== channel.data.name) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` })
        }

        setIsEditing(false)
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])
    console.log(channel)

    useEffect(() => {
        if (!channelName) {
            setTitle(
                members
                    .map(
                        (member) =>
                            member.user?.name +
                            ' (' +
                            member.user?.userType +
                            ')' +
                            ' (' +
                            member.user?.phoneNumber +
                            ')'
                    )
                    .join(', ')
            )
        }
    }, [channelName, members])

    const EditHeader = () => (
        <form
            style={{ flex: 1 }}
            onSubmit={(e) => {
                e.preventDefault()
                inputRef.current.blur()
            }}
        >
            <input
                autoFocus
                className="channel-header__edit-input"
                onBlur={updateChannel}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Type a new name for the chat"
                ref={inputRef}
                value={channelName}
            />
        </form>
    )

    return (
        <Stack direction={'row'} gap={1} p={2}>
            <div id="mobile-nav-icon" className={`${props.theme}`} onClick={() => props.toggleMobile()}>
                <HamburgerIcon />
            </div>
            {getAvatarGroup(members)}
            {!isEditing ? (
                <Stack>
                    <Typography variant="body2" textTransform={'capitalize'} fontWeight={'700'}>
                        {channelName || title}
                    </Typography>
                    {channel?.data?.custom?.metadata?.bookingId && (
                        <Typography variant="body2" component={'span'}>
                            Booking Id:
                            <Link to={`/bookings/${channel?.data?.custom?.metadata?.bookingId}`}>
                                <Typography ml={1} component={'span'} variant="body2" color={'info.main'}>
                                    {channel?.data?.custom?.metadata?.bookingId}
                                </Typography>
                            </Link>
                        </Typography>
                    )}
                </Stack>
            ) : (
                <EditHeader />
            )}
            <div className="messaging__channel-header__right">
                <TypingIndicator />
            </div>
        </Stack>
    )
}

export default React.memo(MessagingChannelHeader)
