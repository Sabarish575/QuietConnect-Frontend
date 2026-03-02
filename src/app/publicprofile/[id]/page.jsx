'use client'


import React from 'react'
import { useParams } from 'next/navigation'
import PublicProfile from '../PublicProfile';
import Header2 from '../../../../Components/Header2';

function page() {

  const {id}=useParams();

  return (
<>
    <Header2/>
    <PublicProfile id={id}/>
</>
  )
}

export default page