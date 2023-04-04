import React from 'react';
import '../styles/styles.css'

const Card = ({ body }) => {
  return (
    <div className='card'>
        <a href={`project/${body.link}`}>
            <img class='card-image' src={body.image?body.image:'https://i.ibb.co/RTSNyBH/default.jpg'} alt='projectImage'></img>
            <div class='card-text'>
              <h2>{body.name}</h2>
              <p className='profile-project-category'>{body.category}</p>
              <p className='card-text-desc'>{body.desc}</p>
              <p>{body.pledged} ETH raised / {body.totalfund} ETH</p>
            </div>
        </a> 
    </div>
  );
};

export default Card;