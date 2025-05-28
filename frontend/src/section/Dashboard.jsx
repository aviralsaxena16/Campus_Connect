import React,{useState,useEffect} from 'react'
import { useUser } from '@clerk/clerk-react';
import socket from '../socket';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from './Sidebar';
import ChatWindow from './chatWindow';


const Dashboard = ({search}) => {
    const {user}=useUser()
    
    
    // useEffect(() => {
    //     if (user) {
    //       socket.emit("register", user.id);
    //     }
    //   }, [user]);

  return (
    <Container>
    <Row>
      <Col xs={12} md={4}><Sidebar search={search}/></Col>
      <Col xs={12} md={8}><ChatWindow/></Col>
    </Row>    
    </Container>
  )
}

export default Dashboard