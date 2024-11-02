"use client"

import React, { useState } from 'react'
import { signInFlow } from '../types'
import SignInCard from './signInCard'
import SignUpCard from './signUpCard'
import { useRouter } from 'next/navigation'
import useCurrentMemeber from '@/features/members/api/useCurrentMemeber'
import { useCurrentUser } from '../api/useCurrentUser'

const AuthScreen = () => {
    const [state, setState] = useState<signInFlow>("signUp");
    const router = useRouter();
    const {data: currentUser} = useCurrentUser();
    if (currentUser) {
      router.replace('/')
    }
  return (
    <div className='h-full flex items-center justify-center bg-[#5c3b58]'>
      <div className='md:h-auto md:w-[420px] '>
        {state == 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}

      </div>
    </div>
  )
}

export default AuthScreen
