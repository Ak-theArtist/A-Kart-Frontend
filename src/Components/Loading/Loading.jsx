import React from "react";
import './Loading.css';
import loading_gif from '../Assets/Loading_gifs/1.gif';

export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <img src={loading_gif} alt="Loading" />
      </div>
    </div>
  );
}
