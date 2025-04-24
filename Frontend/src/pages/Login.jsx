import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axiosInstance"; // Import axios instance

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Include setName from context
    const { setToken, setRole, setName } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/api/admin/login", { email, password });

            const { token, role, name } = response.data;

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name);

            // Update context
            setToken(token);
            setRole(role);
            setName(name);

            // Redirect based on role
            navigate(role === "admin" ? "/admin-dashboard" : "/manager-dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>

                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
