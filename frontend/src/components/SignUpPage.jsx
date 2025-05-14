import React from 'react'
import { SignIn,SignedIn,SignedOut,SignUp } from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
import Home from '../pages/Home'
import { useNavigate } from 'react-router-dom'
const SignUpPage = () => {


  const navigate=useNavigate()
  
  const RedirectToHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/home');
    }, []);
    return null;
  }
  
  return (
    <>
    <SignedOut>
 <SignUp appearance={{
       baseTheme:  neobrutalism,
     }} />
 </SignedOut>

 <SignedIn>
 <RedirectToHome />
       </SignedIn>
       </>
  )
}

export default SignUpPage