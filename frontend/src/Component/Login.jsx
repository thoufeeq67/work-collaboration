import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Navbar from "./Landing/Home";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log(response.data);

        setMessage("Login successful!");
        navigate("/dashboard", { state: { email } });
      } else {
        console.error("Login failed:", response.data.message);
        setMessage(
          response.data.message ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response ? error.response.data.message : error.message
      );
      setMessage(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") || localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  return (
    <>
    <Navbar/>
      <GoogleOAuthProvider clientId="697063750023-7nha10stlk2j37gijq3p2kvgbmpmpu9r.apps.googleusercontent.com">
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>
            {message && (
              <p className="mt-4 text-center text-red-600">{message}</p>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={handleGoogleLoginSuccess}
                className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200"
              >
                {loading ? "Logging In..." : "Login with Google"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">Don't have an account?</p>
              <button
                onClick={() => navigate("/signup")}
                className="mt-2 text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default LoginPage;
