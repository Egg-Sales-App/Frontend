import React from 'react'
import { LineChart, BarChart3, PieChart, DollarSign,CreditCard,SquareX,HandCoins,BrickWall,Warehouse, Users,ClipboardList } from "lucide-react";

import chickenFeed from '../../assets/chicken_feed.png';
import broilers from '../../assets/broilers.jpeg';
import day_old_chicks from '../../assets/day_old_chicks.jpg';

import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import SalesSummary from '../../components/SalesSummary';



const Dashboard = () => {
  return (
    <>
    <div className="flex min-h-screen  pt-[64px]">
      {/* Sidebar on the left */}
      <Sidebar />
  
      {/* Main content area on the right */}
      <div className="ml-[200px] flex-1 flex flex-col min-h-screen ">        {/* Navbar */}
        <Navbar />
  
        {/* Dashboard Sections */}
        <div className="flex gap-4  p-4">
          {/* Left Column: Sales Overview, Purchase Overview, Sales & Purchase */}
          <div className="flex flex-col gap-4 w-[55%]">
          {/* Sales Overview section */}
            <section className="w-full h-[120px] bg-white rounded-lg p-4 shadow relative">
              <h2 className="text-[20px] font-medium text-gray-800 mb-4">Sales Overview</h2>
              <div className="flex justify-between items-start flex-wrap">
                <div className="flex items-center gap-3 w-[116px]">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <BarChart3 size={18} className="text-secondary" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 832</div>
                    <div className="text-sm text-gray-500">Sales</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[163px]">
                  <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <LineChart size={18} className="text-indigo-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 1,300</div>
                    <div className="text-sm text-gray-500">Revenue</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[117px]">
                  <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                    <PieChart size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 868</div>
                    <div className="text-sm text-gray-500">Profit</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[131px]">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <DollarSign size={18} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 1,432</div>
                    <div className="text-sm text-gray-500">Cost</div>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Purchase Overview section */}
            <section className="w-full h-[120px] bg-white rounded-lg p-4 shadow relative">
              <h2 className="text-[20px] font-medium text-gray-800 mb-4">Purchase Overview</h2>
              <div className="flex justify-between items-start flex-wrap">
                <div className="flex items-center gap-3 w-[116px]">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <CreditCard size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 832</div>
                    <div className="text-sm text-gray-500">Purchase</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[163px]">
                  <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <DollarSign size={18} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 1,300</div>
                    <div className="text-sm text-gray-500">Cost</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[117px]">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <SquareX size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 868</div>
                    <div className="text-sm text-gray-500">Cancel</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[131px]">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <HandCoins size={18} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">GHS 1,432</div>
                    <div className="text-sm text-gray-500">Return</div>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Sales & Purchase Chart section */}
            <section className="relative w-full h-[360px] bg-white rounded-[10px] shadow-md p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[20px] text-gray-800 font-medium">Sales & Purchase</h2>
                <div className="flex gap-2">
                  <button className="btn bg-green-300 px-4 py-1 rounded shadow-sm text-sm text-gray-600">Weekly</button>
                  <button className="btn bg-green-300 px-4 py-1 rounded shadow-sm text-sm text-gray-600">Daily</button>
                </div>
              </div>
  
              {/* Y-axis Labels */}
              <div className="absolute left-4 top-[74px] flex flex-col justify-between h-[218px] text-xs text-gray-500">
                {["60,000", "50,000", "40,000", "30,000", "20,000", "10,000"].map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>
  
              {/* Chart Grid */}
              <div className="absolute top-[82px] left-[101px]">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-[460px] h-[41px] border-b border-gray-300"></div>
                ))}
              </div>
  
              {/* Bars */}
              <div className="absolute top-[89px] left-[120px] flex gap-4 items-end">
                {[
                  { purchase: 186, sales: 163 },
                  { purchase: 198, sales: 157 },
                  { purchase: 144, sales: 177 },
                  { purchase: 112, sales: 139 },
                  { purchase: 139, sales: 151 },
                  { purchase: 78, sales: 130 },
                  { purchase: 186, sales: 163 },
                  { purchase: 144, sales: 134 },
                  { purchase: 144, sales: 139 },
                  { purchase: 112, sales: 139 },
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="flex gap-1 items-end">
                      <div
                        className="w-2.5 rounded-b-[40px]"
                        style={{
                          height: `${bar.purchase}px`,
                          background: "linear-gradient(to top, #817AF3, #74B0FA)",
                        }}
                      />
                      <div
                        className="w-2.5 rounded-b-[40px]"
                        style={{
                          height: `${bar.sales}px`,
                          background: "linear-gradient(to top, #46A36C, #51CC5D)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
  
              {/* X-axis labels */}
              <div className="absolute left-[122px] top-[293px] flex gap-5 text-[12px] text-gray-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month, idx) => (
                  <span key={idx}>{month}</span>
                ))}
              </div>
  
              {/* Legends */}
              <div className="absolute left-[141px] top-[341px] flex items-center gap-2 text-[12px] text-gray-500">
                <div className="w-4 h-4 rounded-full" style={{ background: "linear-gradient(to top, #817AF3, #74B0FA)" }}></div>
                <span>Purchase</span>
                <div className="ml-6 w-4 h-4 rounded-full" style={{ background: "linear-gradient(to top, #46A36C, #51CC5D)" }}></div>
                <span>Sales</span>
              </div>
            </section>
          </div>
  
          {/* Right Column: Inventory Summary, Product Summary, Sales Summary*/}
          <div className="flex flex-col gap-4 w-[40%]">

            {/*  Inventory Summary */}
 <section className="w-full h-[145px] bg-white rounded-lg p-4 shadow relative">
 <h2 className="text-[20px] font-medium text-gray-800 mb-4">Inventory Summary</h2>
 <div className="flex justify-between items-start flex-wrap">

  <div className="flex flex-col items-center justify-center text-center  ">
                  <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <BrickWall  size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">868</div>
                    <div className="text-sm text-gray-500">Quantity in hand</div>
                  </div>

                  
    </div>

    <div className="flex flex-col items-center justify-center text-center mr-17">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <Warehouse  size={18} className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">200</div>
                    <div className="text-sm text-gray-500">To be received</div>
                  </div>

                  
    </div>
    
    </div>

  </section>

{/*  Product Summary */}

  <section className="w-full h-[145px] bg-white rounded-lg p-4 shadow relative">
    <h2 className="text-[20px] font-medium text-gray-800 mb-4"> Product Summary</h2>
    <div className="flex justify-between items-start flex-wrap">

  <div className="flex flex-col items-center justify-center text-center  ">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <Users size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">13</div>
                    <div className="text-sm text-gray-500">Number of suppliers</div>
                  </div>

                  
    </div>

    <div className="flex flex-col items-center justify-center text-center mr-12">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <ClipboardList size={18} className="text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-gray-600">21</div>
                    <div className="text-sm text-gray-500">Number of categories</div>
                  </div>

                  
    </div>
    
    </div>
  </section>

  
     <SalesSummary/>
            
      {/*  Low quantity stock */}

            
     <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
      <div className='flex justify-between items-center'>
     <h2 className="text-xl font-semibold text-gray-800 mb-4">Low Quantity Stock</h2>
     <button className='btn bg-white text-blue-500'>see all</button>
     </div>

           {/*chicken feed*/}

       <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 ">
      {/* Image */}
      <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
        <img
          src={chickenFeed}
          alt="Chicken Feed"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center flex-grow">
        <span className="text-[16px] font-semibold text-gray-800">Chicken Feed</span>
        <span className="text-[14px] text-gray-500">Remaining Quantity : 10 Packet</span>
      </div>

      {/* Status Tag */}
      <div className="flex-shrink-0">
        <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
          Low
        </div>
      </div>
    </section>
      
      {/*broilers*/}
     <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 mt-6">
      {/* Image */}
      <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
        <img
          src={broilers}
          alt="broilers"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center flex-grow">
        <span className="text-[16px] font-semibold text-gray-800">Broilers</span>
        <span className="text-[14px] text-gray-500">Remaining Quantity : 15 Packet</span>
      </div>

      {/* Status Tag */}
      <div className="flex-shrink-0">
        <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
          Low
        </div>
      </div>
    </section>

    {/*Day old chicks*/}
     <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 mt-6">
      {/* Image */}
      <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
        <img
          src={day_old_chicks}
          alt="day old chick"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center flex-grow">
        <span className="text-[16px] font-semibold text-gray-800">Day old chicks</span>
        <span className="text-[14px] text-gray-500">Remaining Quantity : 15 Packet</span>
      </div>

      {/* Status Tag */}
      <div className="flex-shrink-0">
        <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
          Low
        </div>
      </div>
    </section>

   
      </section>
  

</div>

        </div>
      </div>
    </div>
  </>
  
  )
}


export default Dashboard