import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import gif from '../Assets/bulb.gif'
import arrow_icon from '../Assets/arrow.png'
import useIntersectionObserver from '../Hooks/Hooks'
import hero_image from '../Assets/hero_image.png'

function Hero() {
  useIntersectionObserver('.animate-right', 'show');
  useIntersectionObserver('.animate-up', 'show');
  useIntersectionObserver('.animate-fade', 'show');
  return (
    <>
      <div id="carouselExampleFadeAutoplaying" className="carousel slide hero carousel-fade" data-bs-ride="carousel">
        <div className="hero-left">
          <div className='animate-right'>
            <div className="hero-hand-icon">
              <p>New</p>
              <span className='tilt'><img src={gif} alt="" /></span>
            </div>
            <p>collections</p>
            <p>for everyone</p>
          </div>
          <div className="hero-latest-btn animate-up scale">
            <div>
              Latest collections
            </div>
            <img src={arrow_icon} alt="" />
          </div>
        </div>
        <div className="carousel-inner animate-fade">
          <div className="carousel-item carousel-1 active">

          </div>
          <div className="carousel-item carousel-2">

          </div>
          <div className="carousel-item carousel-3">

          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFadeAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFadeAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
        {/* <div className="hero-right">
          <img src={hero_image} alt="" />
        </div> */}
      </div>
    </>

  )
}

export default Hero
