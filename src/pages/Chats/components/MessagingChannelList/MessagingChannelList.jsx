import React, { useEffect } from 'react'
import { Avatar, useChatContext } from 'stream-chat-react'

import './MessagingChannelList.css'
import { SkeletonLoader } from './SkeletonLoader'
import { useSearchParams } from 'react-router-dom'

const MessagingChannelList = ({ children, error = false, loading, onCreateChannel }) => {
    const { setActiveChannel } = useChatContext()
    const [sp] = useSearchParams()
    const ListHeaderWrapper = ({ children }) => {
        return <div className="messaging__channel-list">{children}</div>
    }
    useEffect(() => {
        if ((sp.get('customer') || sp.get('worker')) && !children?.props?.children?.length) {
            setActiveChannel()
        }
    }, [children?.props?.children?.length]) // eslint-disable-line

    if (error) {
        return (
            <ListHeaderWrapper>
                <div className="messaging__channel-list__message">
                    Error loading conversations, please try again momentarily.
                </div>
            </ListHeaderWrapper>
        )
    }

    if (loading) {
        return (
            <ListHeaderWrapper>
                <div className="messaging__channel-list__message">
                    <SkeletonLoader />
                </div>
            </ListHeaderWrapper>
        )
    }

    return <ListHeaderWrapper>{children}</ListHeaderWrapper>
}

export default React.memo(MessagingChannelList)
