import React from 'react'
import logo from './assets/chat-2.png'
import {FaTwitter,FaGithub,FaLinkedin } from 'react-icons/fa';

function CopyRights() {
  return (
    
          <div className='grid grid-cols-[1fr_1fr_1fr_2fr]  bg-black place-items-center mt-4 '>
               <div>
               <div className='flex items-center space-0-1 not-[]: py-3'>
                 <img src={logo} alt='logo' className='w-[30px] h-[30px]' />
                 <span className='text-x1 font-semibold text-white'>FeedbackHub</span>
             
               </div>
               <p className='text-gray-500'> use our wonderful to  Streamline your feedback management process with our comprehensive solution to mprove your user ex.</p>
              </div>
                 
                
                
                    <div>
                     <h2 className='py-3 text-white'>Quick Links</h2>
                      <ul className='text-gray-500 '>
                        <li className=' hover:text-white'>Submit Feedback</li>
                        <li className=' hover:text-white'> Track Status</li>
                        <li className=' hover:text-white'>Admin Login</li>
                        <li className=' hover:text-white'>Developer Portal</li>
                        </ul>
                         </div>
   
                        <div>
                         <h2 className='py-3  text-white'>Support</h2>
                     <ul className='text-gray-500  '>
                       <li className=' hover:text-white'>Help Center</li>
                       <li className=' hover:text-white'>Documentation</li>
                       <li className=' hover:text-white'>Contact Us</li>
                       <li className=' hover:text-white'>Privacy Policy</li>
                       </ul>
                       </div>
                      
                       <div className='py-3 text-white'>
                        <h2>Connect</h2>  
                        <div className='flex gap-4 py-3'>
                        <FaTwitter className='text-gray-500  hover:text-white'></FaTwitter>
                        <FaGithub className='text-gray-500 hover:text-white'></FaGithub>
                        <FaLinkedin className='text-gray-500  hover:text-white'></FaLinkedin>
                        </div>
                         </div>
                     
             
        </div>
  )
}

export default CopyRights