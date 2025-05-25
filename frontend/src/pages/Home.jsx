import React,{useState} from 'react'
import bg from '../assets/bg.png';
import Navbar from '../section/Navbar'
import Dashboard from '../section/Dashboard';
const Home = () => {

const [search,setSearch]=useState('')
  return (
    <div
  className="min-h-screen w-full bg-cover bg-center"
  style={{ backgroundImage: `url(https://png.pngtree.com/thumb_back/fw800/background/20190828/pngtree-80-style-background-with-geometric-colorful-shapes-image_307997.jpg)` }}
>
  <Navbar setSearch={setSearch} />
  <Dashboard search={search} />
</div>

  )
}

export default Home


