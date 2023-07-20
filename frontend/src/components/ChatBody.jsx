import React from 'react'
import UserInfo from './chatbody/UserInfo'
import Body from './chatbody/Body'
import UserInput from './chatbody/UserInput'

const ChatBody = () => {
  return (
    <div className='w-2/3 flex flex-col'>
        <div className='bg-indigo-300'><UserInfo /></div>
        <div className='bg-indigo-100 flex-grow overflow-scroll scrollbar-light'><Body /></div>
        <div className='bg-indigo-300'><UserInput /></div>
    </div>
  )
}

export default ChatBody