import React, {useState} from 'react';
import '../styles/styles.css';
import Milestone from '../components/Milestone';
  
const StartProject = () => {
    const [project, setproject] = useState({
        name: '',
        desc: '',
        category: '',
        location: '',
        image: '',
        video: '',
        totalfund: ''
    });
    const [milestones, setmilestones] = useState([]);
    const [numMilestone, setnumMilestone] = useState(1);

    const handleSubmit = async(e) =>{
        e.preventDefault()
        console.log(milestones)
        /*const res = await fetch('/project/add',{
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
        }*/
      
        
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
            if(!data['seq']){
                data['seq'] = index+1; 
            }
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
                
                <button className='create-button' onClick={handleSubmit}>Create</button>
            </div>
        </div>
    );
};
  
export default StartProject;