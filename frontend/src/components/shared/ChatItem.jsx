import React from 'react'
import { Link } from 'react-router-dom'

const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessage,
    index = 0,
    handleDeleteChatOpen
}) => {
  return (
    <Link to={`/chat/${_id}`}>
    
    </Link>
  )
}

export default ChatItem