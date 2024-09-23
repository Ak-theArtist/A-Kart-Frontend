import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllUsers.css';
import Sidebar from '../Sidebar/Sidebar';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`https://a-kart-backend.onrender.com/auth/getAllusers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    alert("You do not have permission to access this resource.");
                } else {
                    console.error(err);
                }
            });            
            axios.get(`https://a-kart-backend.onrender.com/auth/me`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setAdminInfo(response.data);
            })
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    alert("You do not have permission to access this resource.");
                } else {
                    console.error(err);
                }
            });
        } else {
            console.error("No token found");
        }
    }, []);    

    const handleMakeAdmin = async (userId) => {
        try {
            const response = await axios.put(`https://a-kart-backend.onrender.com/auth/makeAdmin/${userId}`);
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, role: 'admin' } : user
            ));
            alert('User role updated to Admin successfully');
        } catch (err) {
            console.error('Error in handleMakeAdmin:', err.response?.data || err.message);
            alert('Error updating user role to Admin');
        }
    };

    const handleRevertAdmin = async (userId) => {
        try {
            const response = await axios.put(`https://a-kart-backend.onrender.com/auth/revertAdmin/${userId}`);
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, role: 'user' } : user
            ));
            alert('User role reverted to User successfully');
        } catch (err) {
            console.error('Error in handleRevertAdmin:', err.response?.data || err.message);
            alert('Error reverting user role to User');
        }
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`https://a-kart-backend.onrender.com/auth/deleteUser/${userId}`)
            .then(response => {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                alert('User deleted successfully');
            })
            .catch(err => console.error(err));
    };

    const isAdmin = (user) => {
        return adminInfo && user.email === adminInfo.email;
    };

    const isSuperAdmin = adminInfo?.email === 'kumarakash91384@gmail.com';
    const filteredUsers = users.filter(user => !isAdmin(user) && user.email !== 'kumarakash91384@gmail.com');

    return (
        <div className="main-container">
            <div className='user-box'>
                <table className='admin-table'>
                    <thead className='table-heading'>
                        <tr className='heading'>
                            <th>Username</th>
                            <th>Email</th>
                            {isSuperAdmin && <th className='action-btns'>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td className='email-cell'>{user.email}</td>
                                {isSuperAdmin && (
                                    <td>
                                        {user.role === 'admin' ? (
                                            <>
                                                <button className='button-allusers' onClick={() => handleRevertAdmin(user._id)}>Revert to User</button>
                                                <button className='button-allusers' onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className='button-allusers' onClick={() => handleMakeAdmin(user._id)}>Make Admin</button>
                                                <button className='button-allusers' onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Sidebar />
        </div>
    );
}

export default AllUsers;
