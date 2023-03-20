import React from 'react';
import '../styles/styles.css'

const Card = ({ body }) => {
  return (
    <div className='card'>
        <a href={`project/${body.link}`}>
            <img class='card-image' src='../public/logo192.png' alt='projectImage'></img>
            <div class='card-text'>
              <h3>{body.name}</h3>
              <p>{body.desc}</p>
            </div>
        </a> 
    </div>
  );
};

export default Card;