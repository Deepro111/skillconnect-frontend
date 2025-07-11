import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddReplyForm = ({ threadId, refreshThreads }) => {
  const { backenedUrl } = useContext(AppContext);
  const [message, setMessage] = useState("");

  const submitReply = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(`${backenedUrl}/api/threads/reply`, {
        threadId,
        message
      });

      if (res.data.success) {
        toast.success("Reply added");
        setMessage("");
        refreshThreads();
      } else {
        toast.error(res.data.message || "Failed to reply");
      }
    } catch (err) {
      toast.error("Error posting reply");
    }
  };

  return (
    <form onSubmit={submitReply} className="mt-3">
      <input
        type="text"
        placeholder="Your reply..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border px-3 py-2 rounded text-sm"
      />
      <button
        type="submit"
        className="mt-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Submit Reply
      </button>
    </form>
  );
};

export default AddReplyForm;
