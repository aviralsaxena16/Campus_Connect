import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import Landing from '../pages/Landing'
import Home from '../pages/Home'
// import Protected from './Protected'
const Routers = () => {
  return (
   <Routes>
    <Route path='/' element={<Landing/>}/>
    <Route path='/home' element={
      <Home/>
      }/>
   </Routes>
  )
}

export default Routers