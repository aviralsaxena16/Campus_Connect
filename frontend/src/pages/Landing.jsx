import React,{useState} from 'react'
import bg from '../assets/bg.png';
import Sign from '../components/Sign';
import { useNavigate } from 'react-router-dom';
import SignUpPage from '../components/SignUpPage';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Landing = () => {
  const navigate=useNavigate()
  const [First,setFirst]=useState(false)

  return (
    <div
    className="h-screen w-full bg-cover bg-center"
    style={{ backgroundImage: `url(${bg})` }}>
      
      <ButtonGroup size="lg" className="mb-2">
        <Button onClick={()=>{setFirst(true)}}>Register</Button>
        <Button onClick={()=>{setFirst(false)}}>Login</Button>
      </ButtonGroup>
       
       
      
      {First ? <Sign/> : <SignUpPage/>}
      

    
    
    
  </div>
  )
}

export default Landing