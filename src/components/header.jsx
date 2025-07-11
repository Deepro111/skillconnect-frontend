import React from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import RotatingText from './rotatingText'

const Header = () => {

  const { userData, isLoggedin } = useContext(AppContext)
  const navigate = useNavigate();

  const handleOnClickheader = () => {
    if (isLoggedin) {
      navigate('/dashboard')
    }
    else {
      navigate('/login')
    }
  }

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt=""
        className='w-36 h-36 rounded-full mb-6' />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData.name ? userData.name : 'Champion'}!
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-2'>Welcome to SkillConnect</h2>

      <p className='text-lg sm:text-xl mb-8 max-w-2xl text-center flex flex-wrap justify-center items-center gap-2'>
        A complete platform to&nbsp;
        <RotatingText
          texts={['connect', 'collaborate', 'learn', 'grow']}
          mainClassName="inline-block bg-gradient-to-br from-blue-300 to-purple-400 text-white px-2 py-1 rounded-md"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
        &nbsp;together.
      </p>

      <button onClick={handleOnClickheader} className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
        {isLoggedin ? "Go to Dashboard"  :
          "Get Started"}
      </button>
    </div>
  )
}

export default Header
