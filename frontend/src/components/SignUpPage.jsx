import React from 'react'
import { SignIn,SignedIn,SignedOut,SignUp } from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
import Home from '../pages/Home'

const SignUpPage = () => {
  return (
    <>
    <SignedOut>
 <SignUp appearance={{
       baseTheme:  neobrutalism,
     }} />
 </SignedOut>

 <SignedIn>
         <Home/>
       </SignedIn>
       </>
  )
}

export default SignUpPage