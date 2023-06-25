import React, {useState} from 'react';
import '../styles/styles.css'
import SnackBar from '../components/Snackbar';
  
const Login = () => {
    const [email, setemail] = useState('');
    const [pw, setpw] = useState('');
    const [open, setOpen] = useState(false);

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
            const data = await res.json();
            //If single value, use res.text()
            sessionStorage.setItem('uid', data.uid);
            sessionStorage.setItem('wallet_address', data.wallet_address);
            window.location.replace('/')
        } else {
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, 2000);
        }
        
        
    }

    return (
        <div className="auth-background">
            <SnackBar message="Invalid email or password" open={open} fail={true} />
            <div className="form" style={{height: '350px'}}>
                <h1>Welcome Back !</h1>
                <p>Log in to continue</p>
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