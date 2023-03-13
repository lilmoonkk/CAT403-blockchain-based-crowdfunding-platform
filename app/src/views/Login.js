import React, {useState} from 'react';
import '../styles/styles.css'
  
const Login = () => {
    const [email, setemail] = useState('');
    const [pw, setpw] = useState('');

    const handleSubmit = async() =>{
        const res = await fetch('/user/login',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email, 
                password: pw
            })
        }).catch(error => alert(error.message));
        if(res.ok){
            const data = await res.text();
            sessionStorage.setItem('uid', data);
            window.location.replace('/')
        }
        
        
    }

    return (
        <div className="background">
            <div className="form">
                <h1>Log In</h1>
                <form className="form-body">
                    <div className="input">
                        <input className="form-input" type="email" id="email" placeholder="Email" onChange={(e) => setemail(e.target.value)}/>
                    </div>
                    <div className="input">
                        <input className="form-input" type="password"  id="password" placeholder="Password" onChange={(e) => setpw(e.target.value)}/>
                    </div>
                </form>
                <button className="submit-button" onClick={() => handleSubmit()}>Login</button>
            </div>
        </div>
    );
};
  
export default Login;