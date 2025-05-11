import React from 'react'
import bg from '../assets/bg.png';
import Navbar from '../components/Navbar'


const Home = () => {
  return (
    <div
          className="h-screen w-full bg-cover bg-center "
          style={{ backgroundImage: `url(${bg})` }}>

      <Navbar/>
            
    </div>
  )
}

export default Home


