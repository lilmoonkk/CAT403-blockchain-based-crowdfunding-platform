import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import { useParams, useNavigate, useLocation } from "react-router-dom"
import '../styles/styles.css';


const UploadProof = (props) => {
    const params = useParams()
    const [proofs, setproofs] = useState([]);
    //alert(params.projectid)
    const {state} = useLocation();
    const data = state.project;
    useEffect(() => {
        async function fetchData(){
            await fetch(`http://localhost:3001/proof/${data._id}/proofs`).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
                setproofs(data);
            }).catch(error => console.log(error.message));
            
        }
        
        fetchData()
    }, []);

  
    return (
      <div class='proof-bg'>
        <div class='upload-proof-bg'>
          <p>Upload proof of completion for  milestone {data.current_mil}<img src='https://firebasestorage.googleapis.com/v0/b/letsfund-5c3de.appspot.com/o/icons%2Fadd.png?alt=media&token=2ac94fc5-6e8f-4b39-9ffb-b8d2df49cf31&_gl=1*xpo58m*_ga*NzQzNTgwMDExLjE2NzUyMzU3ODQ.*_ga_CW55HF8NVT*MTY4NTYzODY5Ny4xNi4xLjE2ODU2MzkwOTkuMC4wLjA.' alt='Add icon'></img></p>
          <ImageUpload project={data}></ImageUpload>
          <p>Please check before submit. Once submitted, it cannot be editted.</p>
        </div>
        <div>
          {Object.entries(proofs).map(([milestone, proofList]) => (
            <div key={milestone}>
              <h3>Milestone {milestone}</h3>
              {proofList.map((proof) => (
                <div key={proof._id}>
                  <img src={proof.imageUrl} alt="Proof" class='proof-img'/>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
};
  
export default UploadProof;