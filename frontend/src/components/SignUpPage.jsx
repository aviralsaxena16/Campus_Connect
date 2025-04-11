import React from 'react'
import { SignIn,SignedIn,SignedOut,SignUp } from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'

const SignUpPage = () => {
  return (
    <>
    <SignedOut>
 <SignUp appearance={{
       baseTheme:  neobrutalism,
     }} />
 </SignedOut>

 <SignedIn>
         <p>You are already signed in!</p>
       </SignedIn>
       </>
  )
}

export default SignUpPage