import React, {useEffect, useState} from 'react';
import '../styles/styles.css';
import Milestone from '../components/Milestone';
import {useNavigate} from 'react-router-dom';
  
const StartProject = () => {
    const navigate = useNavigate();
    const [project, setproject] = useState({
        name: '',
        desc: '',
        category: 'tech&innovation',
        image: '',
        campaign_period: 0,
        totalfund: 0.00,
        owner_address: sessionStorage.getItem('wallet_address')
    });
    const [milestones, setmilestones] = useState([]);
    const [numMilestone, setnumMilestone] = useState(2);
    const [myr, setmyr] = useState((0).toFixed(2))
    const [selectedImages, setSelectedImages] = useState([]);
    

    useEffect(() => {
        if(!sessionStorage.getItem('uid')){
            alert(`Oops! You haven't logged in yet. Please log in to continue.`)
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        const updateTotalFund = () => {
            let result = 0
            for(let i=0; i<milestones.length; i++){
                //console.log(milestones[i].amount)
                result += parseFloat(milestones[i].amount)
            }
            
            setproject((prevState) => {
                return({
                  ...prevState,
                  totalfund: result.toFixed(5)
                });
            });
            
            convertEthMyr(result)
        }

        updateTotalFund()
    }, [milestones]);
    

    const handleSubmit = async(e) =>{
        e.preventDefault()

        let formData = new FormData()
        formData.append('images', selectedImages)
        formData.append('uid', sessionStorage.getItem('uid'));
        formData.append('project', JSON.stringify(project));
        formData.append('milestones', JSON.stringify(milestones));
        
        const res = await fetch('/project/add',{
            method: 'post',
            //headers: {'Content-Type': 'application/json'},
            body: formData
        }).catch(error => alert(error.message));
        if(res.ok){
            alert('Your project have been submitted.')
            window.location.replace('/')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setproject({
          ...project,
          [name]: value,
        });
    };

    const handleImageUpload = (event) => {
        //const file = event.target.files[0];
        //setSelectedImage(URL.createObjectURL(file));
        setSelectedImages(event.target.files[0]);
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

    const convertEthMyr = (amount) => {
        setmyr((amount * 8000).toFixed(2));
    }

    return (
        <div className='background' style={{background: 'rgb(254,248,246)'}}>
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
                    <div className='project-input'>
                        <label className='project-form-label'>Image</label>
                        <input type="file" name="images" onChange={handleImageUpload} />
                    </div>
                    <div className='project-input'>
                        <label className='project-form-label'>Campaign period (day)</label>
                        <input className="project-form-input" type='number' min='0' name='campaign_period' id='campaign_period' value={project.campaign_period} onChange={handleInputChange}/>
                    </div>
                    <p className='conversion-text'>* Your campaign will be started after admin has approved your submission.</p>
                </form>
                <div>
                    <h3 className='milestone-title'>Milestones</h3>
                    {[...Array(numMilestone)].map((_, index) => (
                    <><p className='milestone-title'>Milestone {index+1}</p><Milestone key={index} onChange={(data) => handleMilestonesChange(index, data)} /></>))}
                    <button className='add-milestone-button' onClick={addMilestone}>Add Milestone</button>
                </div>
                
                <p className='total-fund-text'>Total fund: {project.totalfund} ETH</p>
                <p className='conversion-text'> ≈ RM {myr}</p>
                
                <button className='create-button' onClick={handleSubmit}>Create</button>
            </div>
        </div>
    );
};
  
export default StartProject;