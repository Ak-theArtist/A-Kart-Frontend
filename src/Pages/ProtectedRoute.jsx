import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorPage from './ErrorPage';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_BASE_URL}/auth/me`, { withCredentials: true });
                setUser(response.data);
            } catch (err) {
                console.log(err);
                navigate('/error');
            }
        };

        fetchUserData();
    }, [navigate]);

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return <ErrorPage />;
    }


    return <Component {...rest} user={user} />;
};

export default ProtectedRoute;
