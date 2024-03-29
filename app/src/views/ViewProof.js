import React, { useState, useEffect } from 'react';
import { useParams,  useLocation } from "react-router-dom"
import '../styles/styles.css';
import Timer from '../components/Timer';
import SnackBar from '../components/Snackbar';

const ViewProof = (props) => {
    const params = useParams()
    const [proofs, setproofs] = useState([]);
    const [pendingmil, setpendingmil] = useState([]);
    const [pendingProof, setpendingProof] = useState(null);
    const [curmil, setcurmil] = useState(0);
    const {state} = useLocation();
    const milestoneData = state.milestone;
    const pid = state.pid;
    const [open, setOpen] = useState(false);
    const [responded, setResponded] = useState('false');
    const [authentic, setauthentic] = useState(true);
    const [verify, setVerify] = useState(false);

    useEffect(() => {
        /*for(let i=0; i<milestoneData.length; i++){
          if(!milestoneData.approved){
            setcurmil(i)
            break
          }
        }*/
        // -1 is because the current milestone set before is one milestone advanced
        setcurmil(state.cur)
        async function isResponded(){
          await fetch(`/proof/responded/${params.cid}/${state.cur}`).then(function(response) {
              return response.text();
          }).then(function(data) {
              setResponded(data)
          }).catch(error => console.log(error.message));
        }
        isResponded()
    }, []);

    useEffect(() => {
      

      async function fetchData(){
          await fetch(`/proof/${pid}/proofs`).then(function(response) {
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
      }, [curmil]);

    const handleApprove = async(milestone) => {
      const res = await fetch('/proof/approve',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            uid: sessionStorage.getItem('uid'),
            projectid: pid,
            milestone: milestone,
            cid: params.cid,
            approved: true
          })
      }).catch(error => alert(error.message));
      if(res.ok){
        setOpen(true)
        window.location.reload(false);
          //window.location.replace('/')
      }
    };

    const handleReject = async(milestone) => {
      const res = await fetch('/proof/reject',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid: sessionStorage.getItem('uid'),
          projectid: pid,
          milestone: milestone,
          cid: params.cid,
          approved: false
        })
    }).catch(error => alert(error.message));
    if(res.ok){
      setOpen(true)
      window.location.reload(false);
        //window.location.replace('/')
    }
    };

    const handleVerify = async(milestone) => {
      await fetch(`/proof/verify/${pid}/${milestone}`).then(function(response) {
        return response.json();
    }).then(function(data) {
        if(data){
          setauthentic(true)
          setVerify(true)
        } else {
          setauthentic(false)
          setVerify(true)
        }
        setTimeout(() => {
          setVerify(false)
      }, 2000);
    }).catch(error => console.log(error.message));
    };
    
    return (
      <div class='proof-bg'>
        {authentic?(<SnackBar message="This milestone is authentic." open={verify}/>):
        (<SnackBar message="Oh no! This data has been modified!" open={verify} fail={true}/>)}
        <SnackBar message="Your response is recorded" open={open}/>
        <div class='proof-container'>
          <div className="timeline">
            <div className="line" />
            {[...Array(milestoneData.length)].map((_, index) => (
              
              <div
                key={index}
                className={`timeline-item ${curmil > index+1 || state.status == 'Completed successfully' ? 'complete' : curmil == index+1 && 'active'}`}
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
            {responded === 'false'?(
            <div style={{marginTop: '10px'}}>
                <button className='proof-button approve-button' onClick={()=>handleApprove(pendingmil.milestone)}>Approve</button>
                <button className='proof-button approve-button' style={{backgroundColor: '#bf0000'}} onClick={()=>handleReject(pendingmil.milestone)}>Reject</button>
            </div>):
            (<h3>Thanks for your response</h3>)}
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
                {state.status == 'Milestone Rejected' && curmil == milestone?(<div className='milestone-complete-text proof-button' style={{backgroundColor: '#bf0000'}}>Failed</div>):
                (<div className='milestone-complete-text proof-button'>Completed</div>)}
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