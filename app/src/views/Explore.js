import React, {useState, useEffect} from 'react';
import Card from '../components/Card';
import ExploreVerticalNav from '../components/ExploreVerticalNav';
import '../styles/styles.css';

const Explore = () => {
    const [projects, setprojects] = useState([]);

    useEffect(() => {
        async function fetchData(){
            await fetch('/project/projects').then(function(response) {
                return response.json();
            }).then(function(data) {
                //console.log(data);
                setprojects(data);
            }).catch(error => alert(error.message));
            
        }
        
        fetchData()
    }, []);
  
    return (
        <div className='profile-background' style={{display: 'flex'}}>
            <ExploreVerticalNav />
            <div className='cards-container'>
            {projects.map((card) => (
                card.uid !== sessionStorage.getItem('uid') && <Card key={card._id} body={card} />
            ))}
            </div>
        </div>
    );
  };
  
  export default Explore;