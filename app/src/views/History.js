import React, {useState, useEffect} from 'react';
import { useParams} from "react-router-dom"
import '../styles/styles.css';
import {Link} from 'react-router-dom';

const History = () => {
    const params = useParams()
    const [projects, setprojects] = useState([]);
    const [user, setuser] = useState();
    const status = {
        'Approved' : 'Funding Campaign Ongoing',
        'Started' : 'Project Ongoing',
        'Milestone Rejected' : 'Unsuccessful',
        'Waiting for proof approval' : 'Project Ongoing',
        'Claimable' : 'Project Ongoing',
        'All returned' : ' Unsuccessful',
        'Half returned' : 'Unsuccessful',
        'Rejected' : 'Rejected', 
        'Unsuccessful' : 'Unsuccessful'
    }
    
    useEffect(() => {
        async function fetchUser(){
            await fetch(`/user/${params.uid}`).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data)
                setuser(data);
            }).catch(error => console.log(error.message));
        }
        async function fetchData(){
            await fetch(`/project/${params.uid}/projects`).then(function(response) {
                return response.json();
            }).then(function(data) {
                setprojects(data);
            }).catch(error => console.log(error.message));
        }
        fetchUser()
        fetchData()
    }, []);

    return user && (
        <div className='history-background'>
            <div className='user-container'>
                <h2>{user.username}</h2>
                <p>Contact: {user.email}</p>
            </div>
            <div className='profile-project-container'>
            {projects.map((project) => ( project.status !== 'Unsuccessful' &&
                <>
                    <div className='profile-project'>
                        <img className='profile-project-image' src={project.image?project.image:'https://i.ibb.co/RTSNyBH/default.jpg'} alt='projectImage'></img>
                        <div className='profile-project-text'>
                            <div className='profile-project-header'>
                                <h2>{project.name}</h2>
                                <p className='profile-project-category'>{project.category}</p>
                            </div>
                            <p style={{height: "60px"}}>{project.desc}</p>
                            <div className='profile-project-comparison'>
                                <p>{project.pledged?project.pledged.toFixed(5):0} ETH raised / {project.totalfund} ETH</p>
                            </div>
                            <div className='project-status proof-button' >{status[project.status]}</div>
                            
                        </div>
                        {<button className='profile-proof-button'><Link style={{textDecoration: "none", color: "#fff"}} to={{ pathname: `${project._id}/proofs`}} state= {{project:project}} >Proof</Link></button>}
                    </div>
                </>
            ))}
            </div>
        </div>
    );
};
  
export default History;