import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';



const Employee = () => {
  return (
        <div className="flex min-h-screen  pt-[64px]">

          {/* Sidebar on the left */}
      <Sidebar />
  
      {/* Main content area on the right */}
      <div className="ml-[200px] flex-1 flex flex-col min-h-screen ">        {/* Navbar */}
        <Navbar />

       <div className='flex justify-between items-center mt-5'> 
      <h1 className='text-3xl font-bold'>Employees</h1>
<button className="btn bg-blue-600 text-white mr-7">Add Employee</button>


       </div>
       <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-sm text-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Gender</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">User ID</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Pin</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Pat Black', gender: 'Male', id: '12345678', pin: '****' },
              { name: 'Angel Jones', gender: 'Female', id: '12345677', pin: '****' },
              { name: 'Max Edwards', gender: 'Female', id: '12345676', pin: '****' },
              { name: 'Bruce Fox', gender: 'Male', id: '12345675', pin: '****' },
              { name: 'Devon Fisher', gender: 'Male', id: '12345674', pin: '****' },
            ].map((user, idx) => (
              <tr key={idx} className="bg-gray-100 rounded">
                <td className="px-4 py-2 rounded-l-lg">{user.name}</td>
                <td className="px-4 py-2">{user.gender}</td>
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.pin}</td>
                <td className="px-4 py-2 rounded-r-lg">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

        </div>
</div>
  )
}

export default Employee