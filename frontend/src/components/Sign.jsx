import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { SignedIn, SignedOut} from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
import Home from '../pages/Home'

import { useNavigate } from 'react-router-dom'
const Sign = () => {
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
    <SignIn appearance={{
      baseTheme:  neobrutalism,
    }}/>
    </SignedOut>
    
    
    <SignedIn>
    <RedirectToHome />
      </SignedIn>
      </>
  )
}

export default Sign