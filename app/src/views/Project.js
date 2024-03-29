import React, {useEffect, useState} from 'react';
import '../styles/styles.css';
import { useParams, useNavigate } from "react-router-dom"
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import Web3 from 'web3';


const Project = () => {
    const params = useParams()
    const navigate = useNavigate();
    const [project, setproject] = useState({});
    const [pledgeamount, setpleadgeamount] = useState(0.00);
    const [myr, setmyr] = useState((0).toFixed(2))
    const web3 = new Web3(window.ethereum);
    
    useEffect(() => {
        async function fetchData(){
            await fetch(`/project/${params.projectid}/get`).then(function(response) {
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
              /*let valueInHex = '0x0'
              if (pledgeamount > 0){
                const valueInWei = pledgeamount * Math.pow(10, 18);
                console.log('inwei', valueInWei)
                const  intValue = parseInt(valueInWei);
                valueInHex = intValue.toString(16);
                console.log('inhex', valueInHex)
              }
              
              let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              window.ethereum
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: accounts[0],
                  to: project.contract_address,
                  value: valueInHex,
                  //gasPrice: '0x1000',
                  //gas: '0x16354',
                },
              ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error('err',error));*/
            /*const res = await fetch('/project/pledge',{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    uid : sessionStorage.getItem('uid'),
                    projectid : project._id,
                    contract_address: project.contract_address, 
                    caller_address: accounts[0],
                    pledge: pledgeamount
                })
            }).catch(error => alert(error.message));
            if(res.ok){
              //alert('You have placed your pledge successfully!')
                //window.location.replace('/')
            }*/
          
            try {
              const accounts = await web3.eth.getAccounts();
              let valueInHex = '0x0'
              if (pledgeamount > 0){
                const valueInWei = pledgeamount * Math.pow(10, 18);
                console.log('inwei', valueInWei)
                const  intValue = parseInt(valueInWei);
                valueInHex = intValue.toString(16);
                console.log('inhex', valueInHex)
              }
              const transaction = {
                from: accounts[0],
                to: project.contract_address, // Replace with the recipient's address
                value: '0x'+valueInHex, // Replace with the amount of ether to send
              };
            
              const result = await web3.eth.sendTransaction(transaction);
              console.log('Transaction successful:', result);

              const res = await fetch('/project/pledge',{
                  method: 'put',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                      uid : sessionStorage.getItem('uid'),
                      projectid : project._id,
                      contract_address: project.contract_address, 
                      caller_address: accounts[0],
                      pledge: pledgeamount,
                      tx: result.transactionHash
                  })
              }).catch(error => alert(error.message));
              } catch (error) {
                console.error('Error sending transaction:', error);
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

    const convertMyrEth = (e) => {
      setpleadgeamount(e.target.value / 8000);
    }

    return (
      <div className='background' id='project'>
        <div className='project-general'>
            <div className='project-img-container'><img className='project-img' src={project.image?project.image:'https://i.ibb.co/RTSNyBH/default.jpg'} alt='projectImage'></img></div>
            <div>
                <h1>{project.name}</h1>
                <p className='profile-project-category'>{project.category}</p>
                <p>{project.desc}</p>
                <div style={{display:'flex'}}>
                  <Timer targetDate={project.end} />
                  <p>left</p>
                </div>
                <div style={{marginBottom: '20px'}}>
                  <p>{project.pledged?project.pledged.toFixed(5):0} ETH raised / {project.totalfund} ETH</p>
                  <ProgressBar completed={(project.pledged/project.totalfund)*100 > 100 ? 100 : (project.pledged/project.totalfund)*100} />
                </div>
                <a className='know-more-text' href={`/user/${project.uid}/history`}>Want to know about company's history?</a>
            </div>
        </div>
        <div className='divider'></div>
        <div>
            <h2 style={{color: '#005dba', textAlign: 'center'}}>Milestones</h2>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
            {project.milestone?.map((milestone) => (
                <div className='milestone-card'>
                <h3 className='milestone-seq'>{milestone.seq}</h3>
                <h3>{milestone.title}</h3>
                <p>Fund needed: {milestone.amount} ETH</p>
                </div>
            ))}
            </div>
        </div>
        { project.status == 'Approved' && project.uid !== sessionStorage.getItem('uid') &&
        <div className='pledge-container'>
            <form>
              <div style={{display:"flex"}}>
                <label>Enter your pledge amount (ETH):</label>
                <input type="number" value={pledgeamount} onChange={(e) => {setpleadgeamount(e.target.value); convertEthMyr(e)}}/>
                <div style={{margin:"0 10px"}}>≈ RM</div>
                <input type="number" value={myr} onChange={(e) => {setmyr(e.target.value); convertMyrEth(e)}}/>
                
              </div>
            </form>
            <button className='proof-button' style={{background: '#4caf50', margin: '0 30px 0 20px'}} onClick={handlePledge}>Pledge</button>
        </div>}
            
      </div>
    );
  };
  
  export default Project;