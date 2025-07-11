// src/pages/CreateRoom.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const CreateRoom = () => {
    const { backenedUrl } = useContext(AppContext);
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!roomName.trim()) return toast.error("Room name is required");

        try {
            const { data } = await axios.post(`${backenedUrl}/api/manual-rooms/create`, { roomName });

            if (data.success) {
                toast.success("Room Created!");
                navigate(`/manual-room/${data.room.roomId}`);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to create room");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300'>

            <img onClick={() => navigate('/')} src={assets.logo} alt=""
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
            />

            <form onSubmit={handleCreate} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Create Room</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter your Room Name</p>
                <div className='text-indigo-300 mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>

                    <input type="text" placeholder='room name'
                        className='bg-transparent outline-none text-white'
                        value={roomName} onChange={e => setRoomName(e.target.value)} required
                    />
                </div>
                <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Create Room</button>
            </form>
        </div>
    )
};

export default CreateRoom;
