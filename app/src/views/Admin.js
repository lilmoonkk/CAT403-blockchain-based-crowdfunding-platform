import React, {useState, useEffect} from 'react';
import { useParams} from "react-router-dom"
import '../styles/styles.css';

const Admin = () => {
    const [projects, setprojects] = useState([]);
    const [ready, setready] = useState(false);
    const [status, setStatus] = useState(null)
    const params = useParams()

    useEffect(() => {
        // To check if user is authorised
        if(!sessionStorage.getItem('adminloggedin')){
            alert('Please log in first')
            window.location.replace('/admin/login')
        }else{
            setready(true)
        }
    }, []);

    useEffect(() => {
        // To set the status this page is displaying
        if(params.status){
            setStatus(params.status)
        } else {
            setStatus('pending')
        }
    }, [ready]);
    
    async function fetchData() {
        await fetch(`/project/projects/admin/${status}`)
            .then(function (response) {
            return response.json();
            })
            .then(function (data) {
            setprojects(data);
            })
            .catch((error) => console.log(error.message));
    }

    useEffect(() => {
        if (status !== null) {
          fetchData();
        }
    }, [status]);

    const handleApprove = async(pid) => {
        const res = await fetch(`/project/${pid}/approve`,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
        }).catch(error => alert(error.message));
        if(res.ok){
            //alert(`You have approved the project`)
            fetchData()
        }
    }

    const handleReject = async(pid) => {
        const res = await fetch(`/project/${pid}/reject`,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
        }).catch(error => alert(error.message));
        if(res.ok){
            //alert(`You have rejected the project`)
            fetchData()
        }
    }

    return ready && (
        <div className='admin-background'>
            <div className='admin-table'>
                <div className='admin-table-header'>
                    <div className='col-admin-project'>Name</div>
                    <div className='col-admin-desc'>Description</div>
                    <div className='col-admin-catg'>Category</div>
                    <div className='col-admin-total'>Total Fund (ETH)</div>
                    <div className='col-admin-milestone'>Milestone</div>
                    <div className='col-admin-total'>Campaign Period</div>
                    <div className='col-admin-catg'>Status</div>
                </div>
                {projects.map((p) => (
                <div className='contr-table-row'>
                    <div className='col-admin-project'>{p.name}</div>
                    <div className='col-admin-desc'>{p.desc}</div>
                    <div className='col-admin-catg'>{p.category}</div>
                    <div className='col-admin-total'>{p.totalfund}</div>
                    <div className='col-admin-milestone'>
                        {p.milestone.map((m)=> (
                            <div className='admin-milestone-container'>
                                <div className='divider' style={{display: m.seq!==1?'block':'none', margin: '0'}}></div>
                                <p style={{color: '#005dba', fontWeight: '600'}}>Milestone {m.seq} </p>
                                <div style={{display: 'flex'}}>
                                    <p style={{fontWeight:'600', marginRight: '10px'}}>Title: </p>
                                    <p>{m.title}</p>
                                </div>
                                {m.desc && 
                                <div style={{display: 'flex'}}>
                                    <p style={{fontWeight:'600'}}>Description: </p>
                                    <p>{m.desc}</p>
                                </div>
                                }
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <p style={{fontWeight:'600'}}>Amount(ETH): </p>
                                    <p>{m.amount}</p>
                                    <p style={{fontWeight:'600'}}>Percentage: </p>
                                    <p>{parseInt(m.percentage*100)}%</p>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    <div className='col-admin-total'>
                        {p.campaign_period>=1?(<p>{p.campaign_period} day</p>):
                        (<p>{p.campaign_period * 1440} minute</p>)}
                    </div>
                    <div className='col-admin-catg'>
                        {p.status == 'Submitted'?
                        (<>
                        <button className='proof-button approve-button' onClick={() => handleApprove(p._id)}>Approve</button>
                        <button className='proof-button approve-button' style={{backgroundColor: '#bf0000'}} onClick={() => handleReject(p._id)}>Reject</button>
                        </>)
                        :p.status}
                    </div>
                </div>
                ))}
                
            </div>
            <div className='total-cont'>Total projects : {projects.length}</div>
            
        </div>
    );
  };
  
  export default Admin;