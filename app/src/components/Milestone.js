import React, {useState} from 'react';

const Milestone = (props) => {
    const [milestone, setmilestone] = useState({
        title: "",
        desc: "",
        amount: 0,
        percentage: 0
    });
    const [myr, setmyr] = useState((0).toFixed(2))

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setmilestone({...milestone, [name]: value});
    };

    const convertEthMyr = (e) => {
        setmyr((e.target.value * 8000).toFixed(2));
    }

    const convertMyrEth = (e) => {
        setmyr(e.target.value);
        setmilestone({...milestone, amount: (e.target.value / 8000)});
    }

    const handleSave = (e) => {
        e.preventDefault()
        props.onChange(milestone)
    }
   
    return (
        <>
        <form className="form-body">
            <div className="project-input">
                <label className="project-form-label">Title</label>
                <input className="project-form-input" type="text" name="title" id="title" value={milestone.title} onChange={handleInputChange}/>
            </div>
            <div className="project-input">
                <label className="project-form-label">Description</label>
                <textarea className="project-form-input" type="text" name="desc" id="desc" value={milestone.desc} onChange={handleInputChange}/>
            </div>
            <div className="project-input">
                <label className="project-form-label">Fund needed (ETH)</label>
                <input className="project-form-input" style={{width:"30%"}} type="number" min="0" name="amount" value={milestone.amount} onChange={e => { handleInputChange(e); convertEthMyr(e) }}/>
                <div style={{margin:"0 10px"}}>≈ RM</div>  
                <input className="project-form-input" style={{width:"30%"}} type="number" min="0.00" name="amount" value={myr} onChange={e => { convertMyrEth(e); }}/>
            </div>
            <button className="milestone-save-button" onClick={handleSave}>Save</button>
        </form>
        </>
    );
};

export default Milestone;