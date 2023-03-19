import React from 'react'
import { MessageSimple, useMessageContext } from 'stream-chat-react'

import './CustomMessage.css'

const CustomMessage = (props) => {
    const {} = useMessageContext()
    return (
        <>
            <MessageSimple {...props} />
        </>
    )
}

export default CustomMessage
