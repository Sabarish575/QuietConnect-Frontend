import React from 'react'
import Communities from './Communities'
import Header2 from '../../../Components/Header2'
import Footer2 from '../../../Components/Footer2'

function page() {
  return (
    <div className='flex flex-col w-full gap-2 bg-[#0e1113]'>
      <Header2/>

      <Communities/>
      <Footer2/>
    </div>
  )
}

export default page