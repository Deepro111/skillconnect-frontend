import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';

const DashboardHeader = () => {
  const { userData, backenedUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backenedUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData({});
        navigate('/');
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(backenedUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/verify-email');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full px-4 sm:px-10 py-4 flex justify-between items-center bg-white shadow-md">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* User Avatar */}
      {userData?.name ? (
       <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                {!userData.isAccountVerified && 
                <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
                }
                <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
            </ul>
        </div>
      </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default DashboardHeader;
