import React from 'react'
import Header2 from '../../../Components/Header2'
import Footer2 from '../../../Components/Footer2'
import ProfileWizard from './ProfileWizard'

function page() {
  return (
    <section className='w-full flex flex-col justify-between h-screen bg-black'>
        <Header2/>
        <ProfileWizard/>
        <Footer2/>

    </section>
  )
}

export default page