import React, {useEffect, useState} from 'react';
import '../styles/styles.css';
import { useParams } from "react-router-dom"

const Project = () => {
    const params = useParams()
    const [project, setproject] = useState({});

    useEffect(() => {
        async function fetchData(){
            await fetch(`/project/${params.projectid}`).then(function(response) {
                return response.json();
            }).then(function(data) {
                //console.log(data);
                setproject(data);
            }).catch(error => console.log(error.message));
        }
        fetchData()
    }, []);

    return (
      <div className='background' id='project'>
        <div className='project-general'>
            <div className='project-img form'></div>
            <div>
                <h1>{project.name}</h1>
                <p>{project.desc}</p>
                <p>Total fund needed: {project.totalfund} ETH</p>
            </div>
        </div>
        <div style={{width: '200px'}}>
            <h2>Milestones</h2>
            {project.milestone?.map((milestone) => (
                <>
                <p>Milestone {milestone.seq}</p>
                <h3>{milestone.title}</h3>
                <p>Fund needed: {milestone.fund} ETH</p>
                <div className='divider-line'></div>
                </>
            ))}
        </div>
        <div>
            <button className='create-button'>Back</button>
        </div>
            
      </div>
    );
  };
  
  export default Project;