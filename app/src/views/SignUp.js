import React, {useState} from 'react';
import '../styles/styles.css'
import {useNavigate} from 'react-router-dom';
  
const SignUp = () => {
    const navigate = useNavigate();
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [email, setemail] = useState('');
    const [pw, setpw] = useState('');

    const handleNext = async() =>{
        navigate("/signup/connect-wallet"
        ,{state: {firstname: fname, lastname: lname, email: email, password: pw}});
    }

    return (
        <div className="auth-background">
            <div className="form">
                <h1>Sign Up</h1>
                <form className="form-body">
                    <div className="input">
                        <input className="form-input" type="text" id="firstName" placeholder="First Name" onChange={(e) => setfname(e.target.value)}/>
                    </div>
                    <div className="input">
                        <input className="form-input" type="text" id="lastName" placeholder="Last Name" onChange={(e) => setlname(e.target.value)}/>
                    </div>
                    <div className="input">
                        <input className="form-input" type="email" id="email" placeholder="Email" onChange={(e) => setemail(e.target.value)}/>
                    </div>
                    <div className="input">
                        <input className="form-input" type="password"  id="password" placeholder="Password" onChange={(e) => setpw(e.target.value)}/>
                    </div>
                </form>
                <button className="submit-button" onClick={() => handleNext()}>Next</button>
            </div>
        </div>
    );
};
  
export default SignUp;