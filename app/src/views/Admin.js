import React, {useState, useEffect} from 'react';
import '../styles/styles.css';

const Admin = () => {
    const [projects, setprojects] = useState([]);
    
    useEffect(() => {
        async function fetchData(){
            await fetch(`project/projects/admin`).then(function(response) {
                return response.json();
            }).then(function(data) {
                setprojects(data);
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);

    const handleApprove = async(pid) => {
        const res = await fetch(`/project/${pid}/approve`,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
        }).catch(error => alert(error.message));
        if(res.ok){
            alert(`You have approved the project`)
        }
    }

    return (
        <div className='profile-background' style={{display: 'flex'}}>
            
            
            <div className='contr-table'>
                <div className='contr-table-header'>
                    <div className='col-admin-project'>Name</div>
                    <div className='col-admin-desc'>Description</div>
                    <div className='col-admin-catg'>Category</div>
                    <div className='col-admin-total'>Total Fund</div>
                    <div className='col-admin-milestone'>Milestone</div>
                    <div className='col-admin-total'>Campaign Day</div>
                    <div className='col-admin-catg'>Approve</div>
                </div>
                {projects.map((p) => (
                <div className='contr-table-row'>
                    <div className='col-admin-project'>{p.name}</div>
                    <div className='col-admin-desc'>{p.desc}</div>
                    <div className='col-admin-catg'>{p.category}</div>
                    <div className='col-admin-total'>{p.totalfund}</div>
                    <div className='col-admin-milestone'>
                        {p.milestone.map((m)=> (
                            <div style={{display: 'flex'}}>
                                <p>{m.title}</p>
                                <p>{m.amount}</p>
                                <p>{m.percentage}</p>
                            </div>
                        ))
                        }
                    </div>
                    <div className='col-admin-total'>{p.campaign_period}</div>
                    <div className='col-admin-catg'>{p.status == 'Submitted'?(<button className='profile-proof-button' onClick={() => handleApprove(p._id)}>Approve</button>):'Responded'}</div>
                </div>
                ))}
                <div className='total-cont'>Total projects : {projects.length}</div>
            </div>
                
            
        </div>
    );
  };
  
  export default Admin;