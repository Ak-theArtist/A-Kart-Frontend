import React from 'react'
import './NewsLetter.css'

const NewsLetter = (props) => {
  return (
    <div className='newsletter animate-right'>
      <h1 style={{ color: props.mode === 'light' ? 'dark' : 'light' }}>Get Exclusive Offers On Your Email</h1>
      <p style={{ color: props.mode === 'light' ? 'dark' : 'light' }}>Subscribe to our newletter and stay updated</p>
      <div>
        <input type="email" placeholder="Enter Your Email" />
      </div>
      <button className='subscribe-btn scale'>Subscribe</button>
    </div>
  )
}

export default NewsLetter
