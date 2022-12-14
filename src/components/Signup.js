import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';


const Signup = (props) => {
  const [credentials, setcredentials] = useState({name:"",email:"",password:""})
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password} = credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser",{        
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({name,email,password})
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
      //Save the auth token and redirect
      localStorage.setItem('token',json.authToken);
      navigate('/');
      props.showAlert(" Account Created Successfully","success");

  }
  else{
      props.showAlert(" Error! Invalid Email/password ","danger");
  }

}
  const onChange = (e)=>{
    setcredentials({...credentials,[e.target.name]: e.target.value});
 }
  return (
  
    <div className='container mt-3'>
      <h2>SignUp to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" onChange={onChange} name="name" aria-describedby="emailHelp" placeholder="Enter Name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" onChange={onChange} name="email"aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" onChange={onChange} name="password" placeholder="Password" minLength={7} required/>
        </div>
        <div className="form-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" onChange={onChange} name="cpassword"  placeholder="Password" minLength={7} required/>
        </div>

        <button type="submit" className="btn btn-primary mx-2"  >Submit</button>
      </form>
    </div>
  )
}

export default Signup