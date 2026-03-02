import React from 'react'
import AddBlog from './AddBlog'
import Header2 from '../../../Components/Header2'
import Footer2 from '../../../Components/Footer2'

function Page() {
  return (
    <div className="flex flex-col bg-black min-h-screen w-full">

      <Header2 />

      {/* Center AddBlog form vertically and horizontally */}
      <main className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-md">
          <AddBlog />
        </div>
      </main>

      <Footer2 />

    </div>
  )
}

export default Page
