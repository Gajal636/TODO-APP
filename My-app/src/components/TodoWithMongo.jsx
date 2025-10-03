// TodoWithMongo.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Backend URL
const API_URL = "https://todo-app-backend-pi0o.onrender.com";

const TodoWithMongo = () => {
  const [taskValue, setTaskValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    viewTask();
  }, []);

  const viewTask = async () => {
    try {
      const response = await axios.get(`${API_URL}/viewTask`, { withCredentials: true }); // ✅ Fixed URL
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const addTask = async () => {
    if (!taskValue.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/addTask`, // ✅ Fixed URL
        { taskValue },
        { withCredentials: true }
      );
      if (response.data.success) {
        setTasks([...tasks, response.data.task]);
        setTaskValue("");
      }
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/deleteTask/${id}`, { withCredentials: true }); // ✅ Fixed URL
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true }); // ✅ Fixed URL
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">My Todo App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md mb-8">
        <input
          type="text"
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          placeholder="Enter a task..."
        />
        <button type="submit" className="bg-blue-500 text-white px-5 py-3 rounded-xl shadow-md hover:bg-blue-600 transition">
          Add
        </button>
      </form>

      <ul className="w-full max-w-md space-y-3">
        {tasks.length === 0 ? (
          <li className="text-gray-500 text-center italic">No tasks added yet.</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl flex items-center justify-between hover:shadow-md transition"
            >
              <span className="text-gray-800">{task.kyaTaskHai}</span>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoWithMongo;
