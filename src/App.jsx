import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import EmailVerify from './pages/emailVerify'
import ResetPassword from './pages/resetPassword'
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/dashboard'
import TopicRoom from './pages/topicRoom'
import CreateRoom from './pages/createRoom'
import JoinRoom from './pages/joinRoom'
import ManualRoom from './pages/manualRoom'


const App = () => {
  return (
    <div>
      <ToastContainer/>
     <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/verify-email' element={<EmailVerify/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/room/:topicId" element={<TopicRoom />}/>

      <Route path='/create-room' element={<CreateRoom/>} />
      <Route path='/join-room' element={<JoinRoom/>} />
      <Route path="/manual-room/:roomId" element={<ManualRoom />} />
     </Routes>
      
    </div>
  )
}

export default App
