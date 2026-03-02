import React from 'react'
import Header2 from '../../../Components/Header2'
import Chat from './Chat'
import Footer2 from '../../../Components/Footer2'

function Page() {
  return (
    <div className='flex flex-col justify-between bg-[#0e1113] h-screen'>
        <Header2/>
        <Chat/>
        <Footer2/>
    </div>
  )
}

export default Page