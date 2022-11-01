import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
    const [credentials, setcredentials] = useState({email:"",password:""})
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email:credentials.email,password:credentials.password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //Save the auth token and redirect
            localStorage.setItem('token',json.authToken);
            props.showAlert(" :Welcome! ","success");
            navigate('/');

        }
        else{
            props.showAlert(" :Invalid Credentials","danger");
        }

    }
    const onChange = (e)=>{
        setcredentials({...credentials,[e.target.name]: e.target.value});

    }

    return (
        <div className='mt-3'>
            <h2>Login To Continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" value={credentials.email} onChange={onChange} className="form-control" id="email" aria-describedby="emailHelp" name='email' placeholder="Enter email" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" value={credentials.password} onChange={onChange} className="form-control" id="password" name='password' placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary mx-2"  >Submit</button>
            </form>
        </div>
    )
}

export default Login