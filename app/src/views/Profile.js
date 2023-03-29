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
        <div className='background' style={{display: 'flex'}}>
            <VerticalNav />
            <div className='cards-container'>
            {projects.map((project) => (
                <>
                    <div className='card'>
                        <img class='card-image' src='../public/logo192.png' alt='projectImage'></img>
                        <div class='card-text'>
                            <h3>{project.name}</h3>
                            <p>{project.desc}</p>
                            <p>{project.pledged}</p>
                            {project.pledged >= project.totalfund&&
                            (<button onClick={() => handleClaim(project)}>Claim fund of milestone {project.current_mil}</button>)}
                        </div>
                    </div>
                </>
            ))}
            </div>
        </div>
    );
  };
  
  export default Explore;