import React, {useState} from 'react';

const Milestone = (props) => {
    const [milestone, setmilestone] = useState({
        title: "",
        desc: "",
        amount: 0,
        percentage: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setmilestone({...milestone, [name]: value});
    };

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
                <input className="project-form-input" type="number" name="amount" id="amount" value={milestone.amount} onChange={handleInputChange}/>
            </div>
            <button className="milestone-save-button" onClick={handleSave}>Save</button>
        </form>
        </>
    );
};

export default Milestone;