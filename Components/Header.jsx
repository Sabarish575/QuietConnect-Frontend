"use client";
import React, { useState } from 'react'
import Link from 'next/link';

import { SearchIcon,MessageCircleMore,PlusIcon,MenuIcon,ChevronDown,ChevronUp } from 'lucide-react';

function Header() {

  const [sidebar,setSide]=useState(false); 

  const [topicOpen,setTopic]= useState(false);
  const [featureOpen,setfeatureOpen]=useState(false);


  return (

    <>
        <nav className="fixed top-0 flex w-full justify-center bg-[#0e1113] border-[0.5px] border-b-[#3e4142] p-1">
          <div className="flex px-2 py-1 items-center justify-between space-x-2 w-full md:px-4 md:py-2">

            <MenuIcon onClick={()=>setSide(!sidebar)} className='text-md shrink-0 md:hidden text-white'/>
             

            <h1 className='hidden text-md md:text-2xl font-bold lg:text-3xl sm:block'>Quiet-Connect</h1>

            <div className='flex items-center space-x-4'>
              <div className="w-[50px] flex px-2 py-2 space-x-3 bg-[#333d42] text-[#e4e7ea] rounded-3xl focus-within:outline-2 focus:outline-[#e4e7ea] md:w-[300px] lg:px-4 lg:py-2 lg:w-[500px]">
                  <SearchIcon className='text-md shrink-0'/>
                  <input type='text' className='placeholder:hidden focus:outline-none text-sm w-full md:text-base ' placeholder='Search'/>
              </div>

              <div className='cursor-pointer'>
                <MessageCircleMore className='text-md shrink-0 text-white'/>
              </div>

              <div className='flex space-x-2 cursor-pointer'>
                <PlusIcon className='text-md shrink-0 text-white'/>
                <p>Create</p>
              </div>

              <div>
                  <button>Logout</button>
              </div>
            </div>
          </div>
        </nav>

        


    
    
    
    </>






  )
}

export default Header