import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { MessageCircle, FileText, Upload, Download, Folder, Users } from 'lucide-react';

const ManualRoom = () => {
  const { roomId } = useParams();
  const { backenedUrl } = useContext(AppContext);
  const [room, setRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const fileInputRef = useRef();

  const fetchRoomData = async () => {
    try {
      const res = await axios.get(`${backenedUrl}/api/manual-rooms/${roomId}`);
      if (res.data.success) {
        setRoom(res.data.room);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error fetching room");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(`${backenedUrl}/api/manual-rooms/${roomId}/send-message`, { message: newMessage });
      if (res.data.success) {
        setNewMessage('');
        fetchRoomData();
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleNoteUpload = async () => {
    if (!noteFile || !noteTitle.trim()) return toast.error("Fill all note details");
    try {
      const formData = new FormData();
      formData.append("title", noteTitle);
      formData.append("note", noteFile);

      const res = await axios.post(`${backenedUrl}/api/manual-rooms/${roomId}/upload-note`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setNoteFile(null);
        setNoteTitle('');
        fetchRoomData();
        toast.success("Note uploaded");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [roomId]);

  if (!room) return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-gray-600 text-lg'>Loading Room...</p>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 py-6'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            {room.roomName}
          </h2>
          <p className='text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full text-sm font-medium'>
            Room ID: {room.roomId}
          </p>
        </div>

        {/* Messages Section */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            <MessageCircle className='w-5 h-5 text-green-500 mr-2' />
            Chat Messages
          </h3>
          <div className='border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto bg-gray-50 mb-4 shadow-inner'>
            {room.messages?.length ? (
              room.messages.map((msg, i) => (
                <div key={i} className='mb-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100'>
                  <strong className='text-blue-600 font-medium'>
                    {msg.user?.name || "User"}:
                  </strong>
                  <span className='text-gray-700 ml-2'>{msg.message}</span>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <div className='text-center'>
                  <MessageCircle className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            )}
          </div>
          <div className='flex gap-3'>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              placeholder='Type your message...'
            />
            <button 
              onClick={handleSendMessage} 
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm'
            >
              Send
            </button>
          </div>
        </div>

        {/* Notes Upload Section */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            <Upload className='w-5 h-5 text-purple-500 mr-2' />
            Upload Notes
          </h3>
          <div className='space-y-4'>
            <input
              type='text'
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className='border border-gray-300 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
              placeholder='Enter note title...'
            />
            <input
              type='file'
              onChange={(e) => setNoteFile(e.target.files[0])}
              ref={fileInputRef}
              className='hidden'
            />
            <div className='flex gap-3'>
              <button
                onClick={() => fileInputRef.current.click()}
                className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-300 flex items-center gap-2'
              >
                <Folder className='w-4 h-4' />
                Choose File
              </button>
              <button
                onClick={handleNoteUpload}
                className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2'
              >
                <Upload className='w-4 h-4' />
                Upload Note
              </button>
            </div>
            {noteFile && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <p className='text-sm text-blue-700 flex items-center'>
                  <FileText className='w-4 h-4 mr-2' />
                  Selected: <span className='font-medium ml-1'>{noteFile.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes Display */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h4 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            <span className='w-2 h-2 bg-orange-500 rounded-full mr-2'></span>
            Shared Notes
          </h4>
          {room.notes?.length ? (
            <div className='space-y-3'>
              {room.notes.map((note, idx) => (
  <div key={idx} className='bg-gray-50 border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='font-semibold text-gray-800 mb-1'>📝 {note.title}</p>
        <p className='text-sm text-gray-600'>
          Shared by <span className='font-medium text-blue-600'>{note.user?.name || "User"}</span>
        </p>
      </div>
      <div className='flex gap-2'>
        <a
          href={note.url}
          target='_blank'
          rel='noreferrer'
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium'
        >
          📥 View / Download
        </a>
        {note.user?._id === room.createdBy?._id && (
          <button
            onClick={async () => {
              try {
                const res = await axios.post(`${backenedUrl}/api/manual-rooms/${roomId}/delete-note`, {
                  noteUrl: note.url
                });
                if (res.data.success) {
                  toast.success("Note deleted");
                  fetchRoomData();
                } else {
                  toast.error(res.data.message);
                }
              } catch (err) {
                toast.error("Failed to delete note");
              }
            }}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium'
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  </div>
))}

            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <div className='text-4xl mb-2'>📚</div>
              <p>No notes shared yet. Upload the first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualRoom;