"use client";
import React from 'react'

function Header() {


  return (

    <nav className="fixed top-0 flex w-full justify-center ">
      <div className="flex mt-5 px-3 py-2 w-sm items-center justify-between rounded-full  backdrop-blur-lg md:w-2xl max-w-4xl">
        <h1 className='text-xl font-bold md:text-2xl'>Quiet-Connect</h1>

        <div className="flex space-x-2 md:space-x-10">
          <p className='text-md font-semibold cursor-pointer md:text-xl hover:underline hover:underline-offset-3 transition-all duration-500 ease-in'>Login</p>
          <p className='text-md font-semibold cursor-pointer md:text-xl hover:underline hover:underline-offset-3 transition-all duration-500 ease-in'>Create Account</p>
        </div>
      </div>
    </nav>


  )
}

export default Header