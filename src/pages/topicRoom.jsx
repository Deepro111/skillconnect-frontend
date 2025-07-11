import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import AddReplyForm from '../components/addReplyForm'
import { ChevronDown, ChevronUp } from "lucide-react";
import DashboardHeader from '../components/dashboardHeader';

const TopicRoom = () => {
    const { topicId } = useParams();
    const { backenedUrl } = useContext(AppContext);

    const [topic, setTopic] = useState(null);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showRoadmap, setShowRoadmap] = useState(false);


    const handleAskDoubt = async (e) => {
        e.preventDefault();

        if (!title.trim()) return toast.error("Title is required");

        try {
            const res = await axios.post(`${backenedUrl}/api/threads`, {
                topicId,
                title,
                description,
            });

            if (res.data.success) {
                toast.success("Doubt posted!");
                setTitle("");
                setDescription("");
                fetchThreads(); // refresh thread list
            } else {
                toast.error(res.data.message || "Error");
            }
        } catch (err) {
            toast.error("Failed to post doubt");
        }
    };



    const fetchTopicDetails = async () => {
        try {
            const topicRes = await axios.get(`${backenedUrl}/api/topics`);
            const found = topicRes.data.topics.find((t) => t._id === topicId);
            setTopic(found || null);
        } catch (err) {
            toast.error("Failed to load topic info");
        }
    };

    const fetchThreads = async () => {
        try {
            const res = await axios.get(`${backenedUrl}/api/threads/${topicId}`);
            if (res.data.success) {
                setThreads(res.data.threads);
            } else {
                toast.error("Failed to fetch threads");
            }
        } catch (error) {
            toast.error("Error fetching threads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopicDetails();
        fetchThreads();
    }, [topicId]);

    if (!topic) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600 text-lg">Loading topic...</p>
            </div>
        );
    }

    return (
        <>
            <DashboardHeader />
            <div className="p-4 bg-gradient-to-br from-blue-200 to-purple-300">

                {topic && topic.roadmap?.length > 0 && (
                    <div className="sticky top-[64px] z-20 mb-8">
                        {/* Roadmap Header */}
                        <div
                            onClick={() => setShowRoadmap((prev) => !prev)}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl shadow-lg cursor-pointer flex items-center justify-between transition-all hover:brightness-105"
                        >
                            <div>
                                <h2 className="text-xl font-bold mb-1">
                                    Beginner to {topic.name}? Or struggling to find a curated path?
                                </h2>
                                <p className="text-sm text-white/90">
                                    Here's the complete roadmap to go from Beginner to Hero level.
                                </p>
                            </div>
                            {showRoadmap ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </div>

                        {/* Roadmap Steps */}
                        {showRoadmap && (
                            <ul className="mt-6 space-y-4 transition-all duration-300">
                                {topic.roadmap.map((step, idx) => (
                                    <li
                                        key={idx}
                                        className="p-5 bg-white rounded-xl shadow-md border-l-4 border-indigo-500"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                        {step.resourceLink && (
                                            <a
                                                href={step.resourceLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-2 text-indigo-600 text-sm font-medium hover:underline"
                                            >
                                                Visit Resource ↗
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}


                <h2 className="text-xl font-semibold mb-3">Doubts & Discussions</h2>

                <form onSubmit={handleAskDoubt} className="bg-white p-4 rounded shadow mb-6">
                    <h3 className="text-lg font-semibold mb-2">Ask a Doubt</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full border px-3 py-2 mb-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        className="w-full border px-3 py-2 mb-2 rounded"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit Doubt
                    </button>
                </form>


                {loading ? (
                    <p>Loading threads...</p>
                ) : threads.length === 0 ? (
                    <p className="text-gray-500">No doubts posted yet.</p>
                ) : (
                    <div className="space-y-4">
                        {threads.map((thread) => (
                            <div key={thread._id} className="p-4 bg-white rounded shadow">
                                <h3 className="text-lg font-bold">{thread.title}</h3>
                                <p className="text-sm text-gray-600">{thread.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Asked by <strong>{thread.userId?.name}</strong>
                                </p>

                                {thread.replies?.length > 0 && (
                                    <div className="mt-4 space-y-2 bg-gray-50 p-3 rounded">
                                        <h4 className="text-sm font-semibold">Replies:</h4>
                                        {thread.replies.map((reply, i) => (
                                            <div key={i} className="bg-white p-3 rounded shadow-sm text-sm text-gray-800">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-indigo-600">
                                                        {reply.userId?.name || "Unknown User"}
                                                    </span>
                                                </div>
                                                <p>{reply.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}


                                <AddReplyForm threadId={thread._id} refreshThreads={fetchThreads} />
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </>
    );
};

export default TopicRoom;
