import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Sales = () => {
  return (
  <div className="flex min-h-screen  pt-[64px]">
           {/* Sidebar on the left */}
      <Sidebar />
  
      {/* Main content area on the right */}
      <div className="ml-[200px] flex-1 flex flex-col min-h-screen ">        {/* Navbar */}
        <Navbar />

        </div>
          </div>  )
}


export default Sales