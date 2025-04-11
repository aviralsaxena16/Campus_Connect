import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { SignedIn, SignedOut} from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
const Sign = () => {
  return (
    <>
   <SignedOut>
    <SignIn appearance={{
      baseTheme:  neobrutalism,
    }}/>
    </SignedOut>
    
    
    <SignedIn>
        <p>You are already signed in!</p>
      </SignedIn>
      </>
  )
}

export default Sign