import React, { useState, useEffect } from 'react';
import { useParams,  useLocation } from "react-router-dom"
import '../styles/styles.css';


const ViewProof = (props) => {
    const params = useParams()
    const [proofs, setproofs] = useState([]);
    const [approval, setapproval] = useState([]);
    const [pendingProof, setpendingProof] = useState(null);
    const {state} = useLocation();
    const milestoneData = state.milestone;
    useEffect(() => {
        async function fetchData(){
            await fetch(`/proof/${params.projectid}/proofs`).then(function(response) {
                return response.json();
            }).then(function(data) {
                setapproval(data[0])
                let temp = data[0].length
                delete data[0]
                if(data[temp+1]){
                  //Have approval pending proof
                  setpendingProof(data[temp+1])
                  delete data[temp+1]
                }
                //console.log(data);
                setproofs(data);
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
  
    return (
      <div class='proof-bg'>
        <div class='proof-container'>
          {pendingProof && (
          <div className='pending-proof-container'>
            <h3 style={{color: '#005dba'}}>Milestone {pendingProof[0].milestone}</h3>
            <p style={{fontWeight: '600'}}>{milestoneData[pendingProof[0].milestone-1].title}</p>
            <p style={{fontStyle: 'italic'}}>{milestoneData[pendingProof[0].milestone-1].desc && milestoneData[pendingProof[0].milestone-1].desc }</p>
            <div className='proof-img-row-container' style={{justifyContent: 'center'}}>
            {pendingProof.map((proof) => (
              <div key={proof._id} className='proof-img-container'>
                <img src={proof.imageUrl} alt="Proof" class='proof-img'/>
              </div>
            ))}
            </div>
            <div style={{marginTop: '10px'}}>
                <button className='proof-button approve-button' onClick={()=>handleApprove(pendingProof[0].milestone)}>Approve</button>
                <button className='proof-button approve-button' style={{backgroundColor: '#bf0000'}} onClick={()=>handleReject(pendingProof[0].milestone)}>Reject</button>
            </div>
          </div>
          )}
          {Object.entries(proofs).map(([milestone, proofList]) => (
            <div key={milestone}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <h3 style={{color: '#005dba'}}>Milestone {milestone}</h3>
                {approval[milestone-1]&&<div className='milestone-complete-text proof-button'>Completed</div>}
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