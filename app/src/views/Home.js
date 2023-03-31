import React from 'react';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/start-a-project");
  }

  return (
    <div>
      <div className='home-banner'>
        <h1 className='home-caption'>A stepping stone to your goal</h1>
        <button className='home-start-project' onClick={handleClick}>Start a project</button>
      </div>
    </div>
  );
};
  
export default Home;