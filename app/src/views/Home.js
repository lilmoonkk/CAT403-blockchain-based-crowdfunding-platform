import React from 'react';
import {useNavigate} from 'react-router-dom';
import Carousel from '../components/Carousel';

const Home = () => {
  const navigate = useNavigate();

  const handleProject = () => {
    navigate("/start-a-project");
  }

  const handleExplore = () => {
    navigate("/explore");
  }

  return (
    <div>
      <Carousel></Carousel>
      <div className='home-banner'>
        
        <p className='home-caption'>Empowering Visionaries of All Sizes on LETSFUND</p>
        <p className='home-subcaption'>Where Early Adopters and Visionary Contributors Connect to Discover Captivating Projects and Empower the Next Wave of Imagination</p>
        <div className='home-buttons'>
          <button className='home-start-project' onClick={handleProject}>Start a project</button>
          <button className='home-start-project' onClick={handleExplore}>Explore</button>
        </div>
      </div>
    </div>
  );
};
  
export default Home;