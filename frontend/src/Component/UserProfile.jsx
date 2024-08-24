import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [email, setEmail] = useState(''); // Add email state

  useEffect(() => {
    const { email } = location.state || {};
    console.log('Location state:', location.state);
    setEmail(email);
    
  }, [location.state]);
  // Fetch user data based on email provided in the location state
  useEffect(() => {
    const { email } = location.state || {};
    console.log('Location state:', location.state);

    if (email) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('authToken'); 
          const response = await fetch('http://localhost:5000/api/users/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ email }), 
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          
          setEmail(data.email); // Set email state
          setUsername(data.name || ''); // Set username or default to an empty string
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setMessage('Failed to fetch user data. Please try again.');
        }
      };

      fetchUserData();
    } else {
      setMessage('No email provided.');
    }
  }, [location.state]);

  // Handle form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Update user information using the API
    try {
      const response = await fetch('http://localhost:5000/api/users/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: location.state?.email, // Pass the email from the location state
          username,
          password,
        }),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        navigate('/dashboard', { state: { email } });
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Failed to update user data:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 shadow-md">
        <button
          onClick={() => navigate('/dashboard', { state: { email } })}
          className="text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <form className="mt-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded"
              
            />
            {/* Remove email field from display */}
            <input
              type="password"
              placeholder="Change Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-indigo-600 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
