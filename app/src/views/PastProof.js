import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import { useParams,  useLocation } from "react-router-dom"
import '../styles/styles.css';
import SnackBar from '../components/Snackbar';


const PastProof = (props) => {
    const params = useParams()
    const [proofs, setproofs] = useState([]);
    const [pendingmil, setpendingmil] = useState(null);
    const [pendingProof, setpendingProof] = useState(false);
    const {state} = useLocation();
    const [authentic, setauthentic] = useState(true);
    const [verify, setVerify] = useState(false);

    const data = state.project;
    useEffect(() => {
        async function fetchData(){
            await fetch(`http://localhost:3001/proof/${params.projectid}/proofs`).then(function(response) {
                return response.json();
            }).then(function(data) {
                //console.log(data)
                if(data[0]){
                  //setpendingProof(data[data[0]])
                  setpendingmil(data[0].milestone)
                  setpendingProof(true)
                }
                //let temp = data[0].length
                delete data[0]
                if(data){
                  //Have approval pending proof
                  setproofs(data);
                }
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);

    const handleVerify = async(milestone) => {
      await fetch(`/proof/verify/${params.projectid}/${milestone}`).then(function(response) {
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
        <div class='proof-container'>
          {authentic?(<SnackBar message="This milestone is authentic." open={verify}/>):
          (<SnackBar message="Oh no! This data has been modified!" open={verify} fail={true}/>)}
          <div className="timeline">
            <div className="line" />
            {[...Array(data.milestone.length)].map((_, index) => (
              
              <div
                key={index}
                className={`timeline-item ${data.current_mil-1 > index ? 'complete' : data.current_mil-1 == index ? 'active' : ''}`}
                //onClick={() => handleIndexChange(index)}
              >
                <div className='timeline-text'>Milestone {index+1}</div>
              </div>
            ))}
          </div>
          {proofs.length !== 0 && Object.entries(proofs).map(([milestone, proofList]) => (
            <div key={milestone} style={{marginBottom: '30px'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <h3 style={{color: '#005dba'}}>Milestone {milestone}</h3>
                {milestone == pendingmil?
                (<div className='milestone-complete-text proof-button' style={{backgroundColor: '#bf0000'}}>Pending</div>):
                data.status == 'Milestone Rejected'?(<div className='milestone-complete-text proof-button' style={{backgroundColor: '#bf0000'}}>Failed</div>):
                (<div className='milestone-complete-text proof-button'>Completed</div>)}
                <div><button className='profile-proof-button' onClick={()=>handleVerify(milestone)}>Verify</button></div>
              </div>
              <p style={{fontWeight: '600'}}>{data.milestone[milestone-1].title}</p>
              <p style={{fontStyle: 'italic'}}>{data.milestone[milestone-1].desc && data.milestone[milestone-1].desc}</p>
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
  
export default PastProof;