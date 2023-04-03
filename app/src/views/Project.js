import React, {useEffect, useState} from 'react';
import '../styles/styles.css';
import { useParams, useNavigate } from "react-router-dom"
import ProgressBar from '../components/ProgressBar';

const Project = () => {
    const params = useParams()
    const navigate = useNavigate();
    const [project, setproject] = useState({});
    const [pledgeamount, setpleadgeamount] = useState(0.00);
    const [myr, setmyr] = useState((0).toFixed(2))

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

    const handlePledge = async() => {
        const accounts = await window.ethereum.request({method: 'eth_accounts'});   
        //console.log('handlepledge acc', accounts)
        if(!sessionStorage.getItem('uid')){
          alert(`Oops! You haven't logged in yet. Please log in to continue.`)
          navigate('/login')
        } else {
          if(accounts.length){
              //let value = (pledgeamount * 1000000000000000000).toString(16);
              //console.log('test',value)
              /*window.ethereum
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: '0x1610E02866Fce7B278a06FA1EfcCb81b5753AA85',
                  to: project.contract_address,
                  value: '0x'+value,
                  gasPrice: '0x09184e72a000',
                  gas: '0x5208',
                },
              ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error('err',error));*/
            const res = await fetch('/project/pledge',{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    uid : project.uid,
                    projectid : project._id,
                    contract_address: project.contract_address, 
                    caller_address: accounts[0],
                    pledge: pledgeamount
                })
            }).catch(error => alert(error.message));
            if(res.ok){
              alert('You have placed your pledge successfully!')
                //window.location.replace('/')
            }
          
          } else {
            getAccount()
          }
        }
        
    }
        
    async function getAccount() {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('getacc acc', accounts)
    }

    const convertEthMyr = (e) => {
      setmyr((e.target.value * 8000).toFixed(2));
    }

    return (
      <div className='background' id='project'>
        <div className='project-general'>
            <div className='project-img-container'><img className='project-img' src={project.image} alt='projectImage'></img></div>
            <div>
                <h1>{project.name}</h1>
                <p className='profile-project-category'>{project.category}</p>
                <p>{project.desc}</p>
                <div>
                  <p>{project.pledged} ETH raised / {project.totalfund} ETH</p>
                  <ProgressBar completed={(project.pledged/project.totalfund)*100 > 100 ? 100 : (project.pledged/project.totalfund)*100} />
                </div>
            </div>
        </div>
        <div style={{width: '200px'}}>
            <h2>Milestones</h2>
            {project.milestone?.map((milestone) => (
                <>
                <p>Milestone {milestone.seq}</p>
                <h3>{milestone.title}</h3>
                <p>Fund needed: {milestone.amount} ETH</p>
                <div className='divider-line'></div>
                </>
            ))}
        </div>
        <div className='pledge-container'>
            <form>
              <div style={{display:"flex"}}>
                <label>Enter your pledge amount (ETH):
                  <input type="number" onChange={(e) => {setpleadgeamount(e.target.value); convertEthMyr(e)}}/>
                </label>
                <p className='conversion-text' style={{margin:"2px 0 0 0"}}> ≈ RM {myr}</p>
              </div>
            </form>
            <button className='pledge-button' onClick={handlePledge}>Pledge</button>
        </div>
            
      </div>
    );
  };
  
  export default Project;