import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {

    const navigate = useNavigate();

    const {backenedUrl, setIsLoggedin, getUserData} = useContext(AppContext)

    // console.log("getUserData", getUserData);
    
    const [state, setState] = useState('Sign up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();
            // console.log("Entered try block - 1");
            
            axios.defaults.withCredentials = true
            // console.log("Entered try block - 2");
            if(state === 'Sign up'){
                // console.log("Entered try block - 3");
                const {data} = await axios.post(backenedUrl + '/api/auth/register', {name, email, password})
                // console.log("Entered try block - 4");
                // console.log('sign up', data);
                

                if(data.success==true){
                    setIsLoggedin(true);
                    getUserData()
                    navigate('/dashboard' )
                }
                else{
                    toast.error(data.message)
                }
            }
            else{

                const {data} = await axios.post(backenedUrl + '/api/auth/login', {email, password})

                // console.log('Login', data);

                if(data.success){
                    setIsLoggedin(true);
                     getUserData()
                    navigate('/dashboard' )
                }
                else{
                    toast.error(data.message)
                }
            }
        }
        catch(error){
            // console.log("catch block", error.response?.data?.message);
            
            toast.error(error.message || "Something went wrong")
        }

    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-300'>
            <img onClick={()=>navigate('/')} src={assets.logo} alt=""
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
            />

            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign up' ? 'Create account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign up' ? 'Create your account' : 'Login to your account'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.person_icon} alt="" />
                            <input onChange={e => setName(e.target.value)} value={name} className='text-white bg-transparent outline-none' type="text" placeholder='Full Name' required />
                        </div>
                    )}
                    
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)} value={email} className='text-white bg-transparent outline-none' type="email" placeholder='Email' required />
                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)} value={password} className='text-white bg-transparent outline-none' type="password" placeholder='Password' required />
                    </div>
                    <p onClick={()=> navigate('/reset-password') } className='mb-4 text-indigo-500 cursor-pointer'>Forgot password?</p>

                    <button className='w-full py-2.5 rounded-full text-white font-semibold 
                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer'>
                        {state}
                    </button>
                </form>
                
                {state === 'Sign up' ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
                        <span onClick={()=> setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
                    </p>
                ) : 
                (
                    <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
                        <span onClick={()=> setState('Sign up')} className='text-blue-400 cursor-pointer underline'>Sign up</span>
                    </p>
                )}
            
            </div>

        </div>
    )
}

export default Login;
