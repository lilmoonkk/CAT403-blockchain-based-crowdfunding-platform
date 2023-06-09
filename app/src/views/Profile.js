import React, {useState, useEffect} from 'react';
import {Tick} from '../components/svg/Tick.jsx'
import VerticalNav from '../components/VerticalNav';
import ImageUpload from '../components/ImageUpload';
import '../styles/styles.css';
import {Link} from 'react-router-dom';

const Profile = () => {
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
  
    const handleClaim = async(project) => {
        const accounts = await window.ethereum.request({method: 'eth_accounts'});   
        //console.log('handlepledge acc', accounts)

        if(accounts.length){
            const res = await fetch('/project/claim',{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    caller_address: accounts[0],
                    contract_address: project.contract_address, 
                    milestoneseq:project.current_mil
                })
        }).catch(error => alert(error.message));
        if(res.ok){
            alert(`You have claimed the fund of milestone ${project.current_mil}!`)
            //window.location.replace('/')
        }
        } else {
            getAccount()
        }
    }

    async function getAccount() {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('getacc acc', accounts)
    }

    return (
        <div className='profile-background' style={{display: 'flex'}}>
            <VerticalNav />
            <div className='profile-project-container'>
            {projects.map((project) => (
                <>
                    <div className='profile-project'>
                        <img className='profile-project-image' src={project.image?project.image:'https://i.ibb.co/RTSNyBH/default.jpg'} alt='projectImage'></img>
                        <div className='profile-project-text'>
                            <div className='profile-project-header'>
                                <h2><a href={`project/${project.link}`}>{project.name}</a></h2>
                                <p className='profile-project-category'>{project.category}</p>
                            </div>
                            <p style={{height: "60px"}}>{project.desc}</p>
                            <div className='profile-project-comparison'>
                                <p>{project.pledged?project.pledged.toFixed(5):0} ETH raised / {project.totalfund} ETH</p>
                                {project.pledged >= project.totalfund&&<Tick />}
                            </div>
                            {project.status == 'Claimable'&&
                            (<>
                                <p style={{fontSize: "0.9em",color: "#808080"}}>You are now eligible to claim fund for milestone {project.current_mil}</p>
                                <button className='proof-button' style={{background: '#4caf50', margin: '0'}} onClick={() => handleClaim(project)}>Claim Now</button>
                            </>)}
                        </div>
                        <button className='profile-proof-button'><Link style={{textDecoration: "none", color: "#fff"}} to={{ pathname: `${project._id}/proofs`}} state= {{project:project}} >Proof</Link></button>
                    </div>
                </>
            ))}
            </div>
        </div>
    );
  };
  
  export default Profile;