import React from 'react'

function HeroSection() {
  return (

    <section className='w-full px-4 min-h-[350px] flex flex-col space-y-10 items-center justify-center md:min-h-[450px]'>


        <h1 className='text-2xl w-sm text-center tracking-wide md:text-4xl md:w-2xl'>
            Crafted for the <span className='transition duration-500 ease-in-out hover:drop-shadow-[0_0_20px_white]'>introvert</span> whose mind is a cathedral of wonder✨
        </h1>
    </section>


  )
}

export default HeroSection