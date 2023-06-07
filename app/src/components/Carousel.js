import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const myCarousel = () => {
    return (
      <Carousel className="carousel" showThumbs={false}>
        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/letsfund-5c3de.appspot.com/o/icons%2Fpexels-julia-m-cameron-4144179-min.jpg?alt=media&token=e00d9e00-39fb-4ce4-84bb-fd4514b5e497&_gl=1*1n90fnf*_ga*NzQzNTgwMDExLjE2NzUyMzU3ODQ.*_ga_CW55HF8NVT*MTY4NjA2NTIwNS4yMS4xLjE2ODYwNjU0ODcuMC4wLjA." alt="Image 1" />
          <p className="legend">Caption 1</p>
        </div>
        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/letsfund-5c3de.appspot.com/o/icons%2Fpexels-chris-f-6664375-min.jpg?alt=media&token=1b7171be-e399-4150-beb9-9ff0f043d801&_gl=1*10npwew*_ga*NzQzNTgwMDExLjE2NzUyMzU3ODQ.*_ga_CW55HF8NVT*MTY4NjA2NTIwNS4yMS4xLjE2ODYwNjU0ODMuMC4wLjA." alt="Image 2" />
          <p className="legend">Caption 2</p>
        </div>
      </Carousel>
    );
};
  

export default myCarousel;