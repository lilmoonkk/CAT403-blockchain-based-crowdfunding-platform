import React, {useState} from 'react';
import '../styles/styles.css'
  
const AdminLogin = () => {
    const [email, setemail] = useState('');
    const [pw, setpw] = useState('');

    const handleSubmit = async() =>{
        if(email == 'letsfund_admin@gmail.com'){
            const res = await fetch('/user/login',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email, 
                    password: pw
                })
            }).catch(error => alert(error.message));
            if(res.ok){
                sessionStorage.setItem('adminloggedin', true);
                window.location.replace('/admin')
            }
        } else {
            alert('You are not an admin.')
        }  
    }

    return (
        <div className="auth-background">
            <div className="form" style={{height: '350px'}}>
                <h1>Admin Portal</h1>
                <p>**Only admin allowed</p>
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
  
export default AdminLogin;