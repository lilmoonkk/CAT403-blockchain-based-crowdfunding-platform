import React, { useState, useEffect } from 'react';
import { useParams,  useLocation } from "react-router-dom"
import '../styles/styles.css';
import Timer from '../components/Timer';

const ViewProof = (props) => {
    const params = useParams()
    const [proofs, setproofs] = useState([]);
    const [pendingmil, setpendingmil] = useState([]);
    const [pendingProof, setpendingProof] = useState(null);
    const [curmil, setcurmil] = useState(0);
    const {state} = useLocation();
    const milestoneData = state.milestone;
    
    useEffect(() => {
        for(let i=0; i<milestoneData.length; i++){
          if(!milestoneData.approved){
            setcurmil(i)
            break
          }
        }

        async function fetchData(){
            await fetch(`/proof/${params.projectid}/proofs`).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data[0]){
                  setpendingmil(data[0])
                  setpendingProof(data[data[0].milestone])
                  delete data[data[0].milestone]
                  delete data[0]
                }
                
                //let temp = data[0].length
                if(data){
                  //Have approval pending proof
                  setproofs(data);
                }
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);

    const handleApprove = async(milestone) => {
      const res = await fetch('/proof/approve',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            uid: sessionStorage.getItem('uid'),
            projectid: params.projectid,
            milestone: milestone,
            approved: true
          })
      }).catch(error => alert(error.message));
      if(res.ok){
        alert('You have placed your proofs successfully!')
          //window.location.replace('/')
      }
    };

    const handleReject = async(milestone) => {
      const res = await fetch('/proof/reject',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid: sessionStorage.getItem('uid'),
          projectid: params.projectid,
          milestone: milestone,
          approved: false
        })
    }).catch(error => alert(error.message));
    if(res.ok){
      alert('You have placed your proofs successfully!')
        //window.location.replace('/')
    }
    };

    const handleVerify = async(milestone) => {
      await fetch(`/proof/verify/${params.projectid}/${milestone}`).then(function(response) {
        return response.json();
    }).then(function(data) {
        if(data){
          alert('This milestone is authentic.')
        } else {
          alert('Oh no! This data has been modified!')
        }
    }).catch(error => console.log(error.message));
    };
    
    return (
      <div class='proof-bg'>
        <div class='proof-container'>
          <div className="timeline">
            <div className="line" />
            {[...Array(milestoneData.length)].map((_, index) => (
              
              <div
                key={index}
                className={`timeline-item ${curmil >= index ? 'active' : ''}`}
                //onClick={() => handleIndexChange(index)}
              >
                <div className='timeline-text'>Milestone {index+1}</div>
              </div>
            ))}
          </div>
          {pendingProof && (
          <div className='pending-proof-container'>
            <h3 style={{color: '#005dba'}}>Milestone {pendingmil.milestone}</h3>
            <p style={{fontWeight: '600'}}>{milestoneData[pendingmil.milestone-1].title}</p>
            <p style={{fontStyle: 'italic'}}>{milestoneData[pendingmil.milestone-1].desc && milestoneData[pendingmil.milestone-1].desc }</p>
            <div className='proof-img-row-container' style={{justifyContent: 'center'}}>
            {pendingProof.map((proof) => (
              <div key={proof._id} className='proof-img-container'>
                <img src={proof} alt="Proof" class='proof-img'/>
              </div>
            ))}
            </div>
            <div style={{marginTop: '10px'}}>
                <button className='proof-button approve-button' onClick={()=>handleApprove(pendingmil.milestone)}>Approve</button>
                <button className='proof-button approve-button' style={{backgroundColor: '#bf0000'}} onClick={()=>handleReject(pendingmil.milestone)}>Reject</button>
            </div>
            <div style={{display:'flex', justifyContent: 'center'}}>
              <Timer targetDate={pendingmil.end} />
              <p>left</p>
            </div>
            </div>
          )}
          
          {proofs.length !== 0 && Object.entries(proofs).map(([milestone, proofList]) => (
            <div key={milestone}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <h3 style={{color: '#005dba'}}>Milestone {milestone}</h3>
                <div className='milestone-complete-text proof-button'>Completed</div>
                <div><button className='profile-proof-button' onClick={()=>handleVerify(milestone)}>Verify</button></div>
              </div>
              <p style={{fontWeight: '600'}}>{milestoneData[milestone-1].title}</p>
              <p style={{fontStyle: 'italic'}}>{milestoneData[milestone-1].desc && milestoneData[milestone-1].desc}</p>
              <div className='proof-img-row-container' style={{paddingLeft: '-15px'}}>
              {proofList.map((proof) => (
                <div key={proof._id} className='proof-img-container'>
                  <img src={proof} alt="Proof" class='proof-img'/>
                </div>
              ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>
    );
};
  
export default ViewProof;