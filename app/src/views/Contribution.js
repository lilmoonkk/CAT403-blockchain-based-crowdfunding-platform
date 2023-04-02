import React, {useState, useEffect} from 'react';
import VerticalNav from '../components/VerticalNav';
import '../styles/styles.css';

const Explore = () => {
    const [contributions, setcontributions] = useState([]);
    
    useEffect(() => {
        const uid= sessionStorage.getItem('uid')
        async function fetchData(){
            await fetch(`project/${uid}/contributions`).then(function(response) {
                return response.json();
            }).then(function(data) {
                //console.log(data);
                setcontributions(data);
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);

    return (
        <div className='profile-background' style={{display: 'flex'}}>
            <VerticalNav />
            
            
                <div className='contr-table'>
                    <div className='contr-table-header'>
                        <div className='col-project'>Project</div>
                        <div className='col-amount'>Pledged Amount (ETH)</div>
                        <div className='col-tx'>Transaction Hash</div>
                        <div className='col-time'>Time</div>
                    </div>
                    {contributions.map((c) => (
                    <div className='contr-table-row'>
                        <div className='col-project'><a href={`project/${c.link}`}>{c.project_name}</a></div>
                        <div className='col-amount'>{c.amount}</div>
                        <div className='col-tx'>{c.txhash}</div>
                        <div className='col-time'>{c.time}</div>
                    </div>
                    ))}
                    <div className='total-cont'>Total contributions : {contributions.length}</div>
                </div>
                
            
        </div>
    );
  };
  
  export default Explore;