import React from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import Card from './Card'
import GetStarted from './GetStarted'
import Footer from './Footer'

function Landing() {
  return (
    <div className='flex flex-col justify-between pt-20'>
      <Header/>
      <HeroSection/>
      <Card/>
      <GetStarted/>
      <Footer/>

    </div>
  )
}

export default Landing