import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboardHeader';

const Dashboard = () => {
    axios.defaults.withCredentials = true;

    const { backenedUrl, isLoggedin, loadingAuth, userData } = useContext(AppContext);
    // console.log("userData", userData);
    
    const [topics, setTopics] = useState([]);
    const [manualRooms, setManualRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTopics = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backenedUrl}/api/topics`);
            if (data.success) setTopics(data.topics);
            else toast.error("Failed to fetch topics.");
        } catch (error) {
            // console.error("Topic fetch error:", error);
            toast.error("Something went wrong while fetching topics.");
        } finally {
            setLoading(false);
        }
    };

    const fetchManualRooms = async () => {
        try {
            const { data } = await axios.get(`${backenedUrl}/api/manual-rooms`);
            // console.log("data.rooms", data.rooms);
            
            if (data.success) setManualRooms(data.rooms || []);
            else toast.error("Failed to fetch manual rooms.");
        } catch (error) {
            // console.error("Manual room fetch error:", error);
            toast.error("Error fetching manual rooms.");
        }
    };

    useEffect(() => {
        if (!loadingAuth && !isLoggedin) {
            navigate("/login");
        } else {

            fetchTopics();
            fetchManualRooms();
        }
    }, [isLoggedin, loadingAuth]
    );

    return (
        <>
            <DashboardHeader />
            <div className='p-4 min-h-screen bg-gradient-to-br from-blue-200 to-purple-300'>

                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => navigate('/create-room')}
                        className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
                    >
                        Create Room
                    </button>
                    <button
                        onClick={() => navigate('/join-room')}
                        className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
                    >
                        Join Room
                    </button>
                </div>

                {/* 🚪 Manual Rooms (conditionally shown) */}
                {manualRooms.length > 0 && (
                    <>
                        <h2 className='text-xl font-semibold mb-4 text-indigo-700'>Manual Rooms</h2>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10'>
                            {manualRooms.map((room) => (
                                <div
                                    key={room.roomId}
                                    className='bg-white p-4 rounded-xl shadow hover:shadow-md transition border-l-4 border-indigo-500 cursor-pointer'
                                    onClick={() => navigate(`/manual-room/${room.roomId}`)}
                                >
                                    <h3 className='text-lg font-bold'>{room.roomName}</h3>
                                    <p className='text-sm text-gray-600'>Room ID: {room.roomId}</p>
                                    <p className='text-sm text-gray-500 mt-1'>
                                        Created by: {room.createdBy=== userData?.userId ? 'You' : room.createdBy || 'Unknown'}
                                    </p>

                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* 🌍 Public Rooms */}
                <h2 className='text-2xl font-bold mb-4'>Public Rooms</h2>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading rooms...</p>
                    </div>
                ) : (
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {topics.map((topic) => (
                            <div key={topic._id} className='bg-white p-4 rounded-xl shadow hover:shadow-md transition'>
                                {topic.imageUrl && (
                                    <img
                                        src={topic.imageUrl}
                                        alt={topic.name}
                                        className='w-full h-40 object-cover rounded-md mb-3'
                                    />
                                )}
                                <h2 className='text-xl font-semibold'>{topic.name}</h2>
                                <p className='text-sm text-gray-600'>{topic.description}</p>
                                <button
                                    onClick={() => navigate(`/room/${topic._id}`)}
                                    className='mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600'
                                >
                                    Enter Room
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;