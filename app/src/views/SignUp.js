import React from 'react';
import '../styles/styles.css'
import {useNavigate} from 'react-router-dom';
  
const SignUp = () => {
    let navigate = useNavigate();
    return (
        <div className="background">
            <div className="form">
                <h1>Sign In</h1>
                <form className="form-body">
                    <div className="input">
                        
                        <input className="form-input" type="text" id="firstName" placeholder="First Name"/>
                    </div>
                    <div className="input">
                        
                        <input className="form-input" type="text" id="lastName" placeholder="Last Name"/>
                    </div>
                    <div className="input">
                        
                        <input className="form-input" type="email" id="email" placeholder="Email"/>
                    </div>
                    <div className="input">
                        
                        <input className="form-input" type="password"  id="password" placeholder="Password"/>
                    </div>
                </form>
                <button className="submit-button" onClick={() => navigate("/connect-wallet")}>Next</button>
            </div>
        </div>
    );
};
  
export default SignUp;