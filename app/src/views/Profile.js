import React, {useState, useEffect} from 'react';
import Card from '../components/Card';
import VerticalNav from '../components/VerticalNav';
import '../styles/styles.css';

const Explore = () => {
    const [projects, setprojects] = useState([]);
    
    useEffect(() => {
        const uid= sessionStorage.getItem('uid')
        async function fetchData(){
            await fetch(`project/${uid}/projects`).then(function(response) {
                return response.json();
            }).then(function(data) {
                //console.log(data);
                setprojects(data);
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);
  
    return (
        <div className='background' style={{display: 'flex'}}>
            <VerticalNav />
            <div className='cards-container'>
            {projects.map((project) => (
                <>
                    <div className='card'>
                        <a href={`project/${project.link}`}>
                            <img class='card-image' src='../public/logo192.png' alt='projectImage'></img>
                            <div class='card-text'>
                            <h3>{project.name}</h3>
                            <p>{project.desc}</p>
                            </div>
                        </a> 
                    </div>
                </>
            ))}
            </div>
        </div>
    );
  };
  
  export default Explore;