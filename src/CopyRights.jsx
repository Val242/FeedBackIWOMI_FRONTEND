import React from 'react'
import logo from './assets/chat-2.png'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

function CopyRights() {
  return (
    <div className='grid grid-cols-[1fr_1fr_1fr_2fr] bg-black place-items-center justify-items-center mt-4 pl-[60px] pt-[10px] pb-[10px]'>
      <div className="text-center">
        <div className='flex flex-col items-center py-3'>
          <img src={logo} alt='logo' className='w-[30px] h-[30px] mx-auto' />
          <span className='text-xl font-semibold text-white mt-2'>FeedbackHub</span>
        </div>
        <p className='text-gray-500'>
          Simplify feedback management and enhance user experience with our all-in-one tool
        </p>
      </div>

      <div className="text-center">
        <h2 className='py-3 text-white'>Quick Links</h2>
        <ul className='text-gray-500'>
          <li className='hover:text-white'>Submit Feedback</li>
          <li className='hover:text-white'>Track Status</li>
          <li className='hover:text-white'>Admin Login</li>
          <li className='hover:text-white'>Developer Portal</li>
        </ul>
      </div>

      <div className="text-center">
        <h2 className='py-3 text-white'>Support</h2>
        <ul className='text-gray-500'>
          <li className='hover:text-white'>Help Center</li>
          <li className='hover:text-white'>Documentation</li>
          <li className='hover:text-white'>Contact Us</li>
          <li className='hover:text-white'>Privacy Policy</li>
        </ul>
      </div>

      <div className='py-3 text-white text-center'>
        <h2>Connect</h2>
        <div className='flex gap-4 py-3 justify-center'>
          <FaTwitter className='text-gray-500 hover:text-white' />
          <FaGithub className='text-gray-500 hover:text-white' />
          <FaLinkedin className='text-gray-500 hover:text-white' />
        </div>
      </div>
    </div>
  )
}

export default CopyRights