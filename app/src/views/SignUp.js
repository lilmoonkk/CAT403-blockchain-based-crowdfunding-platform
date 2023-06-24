import React, {useState} from 'react';
import '../styles/styles.css'
import {useNavigate} from 'react-router-dom';
  
const SignUp = () => {
    const navigate = useNavigate();
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [pw, setpw] = useState('');

    const handleNext = async() =>{
        navigate("/signup/connect-wallet"
        ,{state: {username: name, email: email, password: pw}});
    }

    return (
        <div className="auth-background">
            <div className="form">
                <h1>Sign Up</h1>
                <form className="form-body">
                    <div className="input">
                        <input className="form-input" type="text" id="username" placeholder="Username" onChange={(e) => setname(e.target.value)}/>
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