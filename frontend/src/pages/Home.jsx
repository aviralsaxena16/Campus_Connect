import React from 'react'
import bg from '../assets/bg.png';
import Navbar from '../section/Navbar'
import Dashboard from '../section/Dashboard';
const Home = () => {
  return (
    <div
          className="h-screen w-full bg-cover bg-center "
          style={{ backgroundImage: `url(${bg})` }}>

      <Navbar/>
      
      {/* <Dashboard/> */}
    </div>
  )
}

export default Home


