import React,{useState} from 'react'
import Sign from './Sign';
import { useNavigate } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Login = () => {
  
  const [First,setFirst]=useState(false)

  return (
    <div>
      
      <ButtonGroup size="lg" className="mb-2">
        <Button variant="warning" onClick={()=>{setFirst(true)}}>Sign In</Button>
        <Button variant="warning" onClick={()=>{setFirst(false)}}>Register</Button>
      </ButtonGroup>
       
      {First ? <Sign/> : <SignUpPage/>}
    
    
  </div>
  )
}

export default Login