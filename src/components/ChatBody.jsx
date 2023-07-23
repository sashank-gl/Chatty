import React from 'react'
import UserInfo from './chatbody/UserInfo'
import Body from './chatbody/Body'
import UserInput from './chatbody/UserInput'

const ChatBody = () => {
  return (
    <div className='flex flex-col pt-12 h-main'>
        <div className='bg-indigo-200'><UserInfo /></div>
        <div className='bg-indigo-100 flex-grow overflow-scroll scrollbar-light'><Body /></div>
        <div className='bg-indigo-200'><UserInput /></div>
    </div>
  )
}

export default ChatBody