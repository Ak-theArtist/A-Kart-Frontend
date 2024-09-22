import React from "react";
import './Loading.css'; 
import admin_loading_gif from '../Assets/Loading_gifs/2.gif';

export default function AdminLoading() {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <img src={admin_loading_gif} alt="Loading..." />
      </div>
    </div>
  );
}
