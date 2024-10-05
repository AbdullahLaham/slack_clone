"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react'
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signInFlow } from '../types';
import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlert } from 'lucide-react';

interface signUpCardProps {
  setState: (state: signInFlow) => void,
}


const SignUpCard = ({setState}: signUpCardProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const {signIn} = useAuthActions();

    const onProvider = (value: 'github' | 'google') => {
      setPending(true);
      signIn(value)
      .finally(() => setPending(false))
    }

    const passwordProvider = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError('password does not match');
        return
      }
      setPending(true);
      signIn("password", {name, email, password, flow: 'signUp'})
      .catch(() => setError('something went wrong'))
      .finally(() => setPending(false))

    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            Create a new account
        </CardTitle>
        <CardDescription>
            Use your email or another service to continue.

        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
          <TriangleAlert className='size-4'  />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-2 px-2 pb-0'>
        <form className='space-y-2.5' onSubmit={passwordProvider}>
            <Input disabled={pending} type='text' placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} required />
            <Input disabled={pending} type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input disabled={pending} type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <Input disabled={pending} type='password' placeholder='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
            <Button type='submit' className='w-full ' size={'lg'} disabled={pending} >
                Sign Up
            </Button>
        </form>
        <Separator />
        <div className='flex flex-col space-y-3'>
            <Button disabled={pending} onClick={() => onProvider('google')}  value={'outline'} size={'lg'} className='w-full relative'>
                Continue with Google
                <FcGoogle className='size-5 absolute left-3 top-3' />
            </Button>
            <Button disabled={pending} onClick={() => onProvider('github')}  value={'outline'} size={'lg'} className='w-full relative'>
                Continue with Github
                <FaGithub className='size-5 absolute left-3 top-3' />
            </Button>

        </div>
        <p className='text-xs text-muted-foreground flex items-center my-2'>
            Don&apos;t have an acoount <p className='text-sky-600 font-semibold hover:underline cursor-pointer' onClick={() => setState('signIn')}>SignIn</p>
        </p>

      </CardContent>
    </Card>
  )
}

export default SignUpCard
