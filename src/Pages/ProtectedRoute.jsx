import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorPage from './ErrorPage';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://a-kart-backend.onrender.com/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                })
                setUser(response.data);
            } catch (err) {
                console.log(err);
                navigate('/error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return <ErrorPage />;
    }

    return <Component {...rest} user={user} />;
};

export default ProtectedRoute;
