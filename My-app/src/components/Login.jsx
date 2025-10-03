import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Backend URL
const API_URL = "https://todo-app-backend-pi0o.onrender.com";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    let newErrors = {};
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      loginUser();
    }
  };

  // Login user
  const loginUser = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/login`, // ✅ Fixed URL
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true } // ✅ Already correct
      );
      
      if (res.data && res.data.success) {
        setMessage(res.data.message || "Login successful");
        console.log("Redirecting...");
        navigate("/"); // redirect to home
      } else {
        setMessage(res.data?.message || "Login failed");
      }
    } catch (err) {
      setMessage(
        "Login failed: " + (err.response?.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-300"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-300"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Login
        </button>

        {/* Message */}
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
