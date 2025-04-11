import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { SignedIn, SignedOut} from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
import Home from '../pages/Home'
const Sign = () => {
  return (
    <>
   <SignedOut>
    <SignIn appearance={{
      baseTheme:  neobrutalism,
    }}/>
    </SignedOut>
    
    
    <SignedIn>
        <Home/>
      </SignedIn>
      </>
  )
}

export default Sign