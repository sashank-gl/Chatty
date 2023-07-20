import React, { useContext } from 'react'
import { ChatContext } from '../../contexts/ChatContext'

const UserInfo = () => {

  const { data } = useContext(ChatContext)

  return (
    <div className='h-16 flex items-center text-2xl font-semibold ml-3'>
      {data.user?.displayName}
    </div>
  )
}

export default UserInfo