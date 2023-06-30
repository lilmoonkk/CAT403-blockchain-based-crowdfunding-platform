import React, {useState, useEffect} from 'react';
import {Tick} from '../components/svg/Tick.jsx'
import VerticalNav from '../components/VerticalNav';
import '../styles/styles.css';
import {Link} from 'react-router-dom';
import SnackBar from '../components/Snackbar';

const Profile = () => {
    const [projects, setprojects] = useState([]);
    const [open, setOpen] = useState(false);
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
            setOpen(true)
            //alert(`You have claimed the fund of milestone ${project.current_mil}!`)
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
            <SnackBar message="You have claimed the fund of the next milestone!" open={open}/>
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
                            <div className='project-status proof-button' >{status[project.status]?status[project.status]:project.status}</div>
                        </div>
                        <div style={{width: '105px'}}>
                            <button className='profile-proof-button'><Link style={{textDecoration: "none", color: "#fff"}} to={{ pathname: `${project._id}/proofs`}} state= {{project:project}} >Proof</Link></button>
                            {project.status == 'Claimable'&&
                            (
                                <button className='proof-button' style={{background: '#4caf50'}} onClick={() => handleClaim(project)}>Claim</button>
                            )}
                        </div>
                        
                    </div>
                </>
            ))}
            </div>
        </div>
    );
  };
  
  export default Profile;