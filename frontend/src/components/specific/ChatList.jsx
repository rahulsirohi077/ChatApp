import { Stack } from '@mui/material'
import React from 'react'

const ChatList = ({
    w='100%',
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [
        {
            chatId: "1",
            count: 1,
        },
    ],
    handleDeleteChat,
}) => {
  return (
    <Stack width={w}>
        {
            chats.map((data)=>{
                return <div>{data}</div>
            })
        }
    </Stack>
  )
}

export default ChatList