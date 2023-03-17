import React, {useEffect, useState} from 'react';
import '../styles/styles.css';
import Milestone from '../components/Milestone';
  
const StartProject = () => {
    const [project, setproject] = useState({
        name: '',
        desc: '',
        category: 'tech&innovation',
        location: '',
        image: '',
        video: '',
        totalfund: 0.00
    });
    const [milestones, setmilestones] = useState([]);
    const [numMilestone, setnumMilestone] = useState(1);

    useEffect(() => {
        const updateTotalFund = () => {
            let result = 0
            for(let i=0; i<milestones.length; i++){
                console.log(milestones[i].fund)
                result += parseFloat(milestones[i].fund)
            }
            
            setproject((prevState) => {
                return({
                  ...prevState,
                  totalfund: result.toFixed(3)
                });
            });
        }

        updateTotalFund()
    }, [milestones]);
    

    const handleSubmit = async(e) =>{
        e.preventDefault()
        
        const res = await fetch('/project/add',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                uid: sessionStorage.getItem('uid'), 
                project: project,
                milestones: milestones
            })
        }).catch(error => alert(error.message));
        if(res.ok){
            //window.location.replace('/')
        }
      
        
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setproject({
          ...project,
          [name]: value,
        });
    };

    const addMilestone = () => {
        setnumMilestone(numMilestone + 1);
    };

    const handleMilestonesChange = (index, data) => {
        setmilestones((prevData) => {
            const newData = [...prevData];
            newData[index] = data;
            return newData;
        });
    }

    return (
        <div className='background'>
            <div className='project-form'>
                <h1>Let's get ready to start your project!</h1>
                <form className='form-body'>
                    <div className='project-input'>
                        <label className='project-form-label'>Name</label>
                        <input className='project-form-input' type='text' name='name' id='name' value={project.name} onChange={handleInputChange}/>
                    </div>
                    <div className='project-input'>
                        <label className='project-form-label'>Description</label>
                        <textarea className='project-form-input' name='desc' id='desc' value={project.desc} onChange={handleInputChange}/>
                    </div>
                    <div className='project-input'>
                        <label className='project-form-label'>Category</label>
                        <select className='project-form-input' name='category' style={{width: 'calc(80% + 20px)'}} onChange={handleInputChange}>
                            <option value='tech&innovation'>Tech and Innovation</option>
                            <option value='creativeworks'>Creative Works</option>
                            <option value='communityprojects'>Community Projects</option>
                        </select>
                    </div>
                </form>
                <div>
                    <h3 className='milestone-title'>Milestones</h3>
                    {[...Array(numMilestone)].map((_, index) => (
                    <><p className='milestone-title'>Milestone {index+1}</p><Milestone key={index} onChange={(data) => handleMilestonesChange(index, data)} /></>))}
                    <button className='add-milestone-button' onClick={addMilestone}>Add Milestone</button>
                </div>
                <p className='total-fund-text'>Total fund: {project.totalfund} ETH</p>
                <button className='create-button' onClick={handleSubmit}>Create</button>
            </div>
        </div>
    );
};
  
export default StartProject;