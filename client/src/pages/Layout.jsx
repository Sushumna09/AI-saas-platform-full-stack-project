import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setsidebar] = useState(false)
  const{user} =useUser()

  return user ?  (
    <div className='flex flex-col h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <img className='cursor-pointer w-32 sm:w-44'
          src={assets.logo}
          alt=''
          className='cursor-pointer'
          onClick={() => navigate('/')}
        />

        {sidebar ? (
          <X
            onClick={() => setsidebar(false)}
            className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer'
          />
        ) : (
          <Menu
            onClick={() => setsidebar(true)}
            className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer'
          />
        )}
      </nav>

      <div className='flex flex-1 w-full h-[calc(100vh-64px)]'>
        <Sidebar
          sidebar={sidebar}
          setsidebar={setsidebar}
        />

        <div className='flex-1 bg-[#F4F7FB] p-6 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  ): (
    <div className='flex items-center justify-center h-screen'>
      <SignIn/>
    </div>
  )
}

export default Layout