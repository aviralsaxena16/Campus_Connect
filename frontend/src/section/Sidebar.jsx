import React,{useState,useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Sidebar = () => {
  const [tab,setTab]=useState(0)

  return (
    <div>
    <ButtonGroup className="mb-2" >
      <Button onClick={()=>{setTab(0)}} variant="success">Channels</Button>
      <Button onClick={()=>{setTab(1)}} variant="danger">Personal</Button>
    </ButtonGroup>
    </div>
  )
}

export default Sidebar