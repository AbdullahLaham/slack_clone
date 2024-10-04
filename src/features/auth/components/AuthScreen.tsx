"use client"

import React, { useState } from 'react'
import { signInFlow } from '../types'
import SignInCard from './signInCard'
import SignUpCard from './signUpCard'

const AuthScreen = () => {
    const [state, setState] = useState<signInFlow>("signIn")
  return (
    <div className='h-full flex items-center justify-center bg-[#5c3b58]'>
      <div className='md:h-auto md:w-[420px] '>
        {state == 'signIn' ? <SignInCard /> : <SignUpCard />}

      </div>
    </div>
  )
}

export default AuthScreen
