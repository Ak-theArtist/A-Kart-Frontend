import React, { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from '../AdminPanel/Components/Sidebar/Sidebar';
import background_video from '../AdminPanel/Components/assets/Video.mp4';
import axios from 'axios';

const Admin = () => {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    axios.get('https://a-kart-backend.onrender.com/auth/me', {
      headers: {
          'Authorization': `Bearer ${token}` 
      }
  })
      .then(response => {
        setAdminInfo(response.data);
        console.log(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <div className='admin'>
        <h1 className='welcome scale text-center'>
          Welcome, {adminInfo && adminInfo.role === 'admin' ? <h1>{adminInfo.name}</h1> : <>But this page is <br /> only for Admin.<br />You can't do anything here</>}
        </h1>
        <Sidebar />
        <video autoPlay={true} muted loop id="myVideo">
          <source src={background_video} type="video/webm" />
        </video>
      </div>
    </>
  );
};

export default Admin;
