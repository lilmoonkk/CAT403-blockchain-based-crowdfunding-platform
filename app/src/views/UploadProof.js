import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import { useParams,  useLocation } from "react-router-dom"
import '../styles/styles.css';



const UploadProof = (props) => {
    const params = useParams()
    const [proofs, setproofs] = useState([]);
    const [approval, setapproval] = useState([]);
    const [pendingProof, setpendingProof] = useState(false);
    const {state} = useLocation();
    const data = state.project;
    useEffect(() => {
        async function fetchData(){
            await fetch(`http://localhost:3001/proof/${params.projectid}/proofs`).then(function(response) {
                return response.json();
            }).then(function(data) {
                setapproval(data[0])
                let temp = data[0].length
                delete data[0]
                if(data[temp+1]){
                  //Have approval pending proof
                  setpendingProof(true)
                }
                //console.log(data);
                setproofs(data);
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);


  
    return (
      <div class='proof-bg'>
        <div class='proof-container'>
          <div className='pending-proof-container'>
            {pendingProof?(<h3>Image upload is not available at the moment due to pending proofs of completion</h3>):(
            <div className='upload-proof-container'>
              <h3>Upload proof of completion for  milestone {data.current_mil}</h3>
              <ImageUpload project={data}></ImageUpload>
            </div>
            )}
          </div>
          {Object.entries(proofs).map(([milestone, proofList]) => (
            <div key={milestone} style={{marginBottom: '30px'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <h3 style={{color: '#005dba'}}>Milestone {milestone}</h3>
                {approval[milestone-1]?
                (<div className='milestone-complete-text proof-button'>Completed</div>):
                (<div className='milestone-complete-text proof-button' style={{backgroundColor: '#bf0000'}}>Pending</div>)}
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
  
export default UploadProof;