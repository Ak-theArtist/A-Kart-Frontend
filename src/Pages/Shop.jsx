import React from 'react'
import { useState, useEffect } from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import phone from '../Components/Assets/caller.png'
import '../App.css'


const Shop = (props) => {
  document.title = 'A-Kart - Home'
  console.log(props)

  return (
    <div>

      <Hero />
      <div className="caller">
        <div data-bs-toggle="modal" data-bs-target="#exampleModal">
          <img className='calling-phone-icon' src={phone} alt="" />
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className={`modal-dialog bs-modal-bg-${props.mode === 'light' ? 'dark' : 'light'}`}>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Contact Us</h1>
              </div>
              <div className="modal-body">
                9528356789 <br />
                7658940345
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popular />
      <Offers />
      <NewCollections />
      <NewsLetter />
    </div>
  )
}

export default Shop
