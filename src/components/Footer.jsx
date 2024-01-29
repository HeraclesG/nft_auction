import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#2b2b2b] w-full  h-1/5'>
      <div className="w-4/5 flex sm:flex-row flex-col justify-between items-center mx-auto min-h-screen">
        <div className="hidden sm:flex flex-1 justify-start items-center space-x-12">
          <p className="text-white text-base text-center cursor-pointer">
            Market
          </p>
          <p className="text-white text-base text-center cursor-pointer">
            Artist
          </p>
          <p className="text-white text-base text-center cursor-pointer">
            Features
          </p>
          <p className="text-white text-base text-center cursor-pointer">
            Community
          </p>
        </div>

        <p className="text-white text-right text-xs">
          &copy;2024 All rights reserved
        </p>
      </div>
    </div>
  )
}

export default Footer
