import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='progress-bar' style={{ position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 100 }}>
      <div
        style={{
          height: '5px',
          width: `${scrollProgress}%`,
          backgroundColor: '#3b82f6',
          transition: 'width 0.25s'
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
