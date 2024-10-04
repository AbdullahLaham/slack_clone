import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react'
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const SignInCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            Login to continue
        </CardTitle>
        <CardDescription>
            Use your email or another service to continue.

        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-0 px-0 pb-0'>
        <form className='space-y-2.5'>
            <Input disabled={false} type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <Input disabled={false} type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <Button type='submit' className='w-full ' size={'lg'} disabled={false}>
                Sign In

            </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-3'>
            <Button disabled={false} onClick={() => {}}  value={'outline'} size={'lg'} className='w-full relative'>
                Continue with Google
                <FcGoogle className='size-5 absolute left-3 top-3' />
            </Button>
            <Button disabled={false} onClick={() => {}}  value={'outline'} size={'lg'} className='w-full relative'>
                Continue with Github
                <FaGithub className='size-5 absolute left-3 top-3' />
            </Button>

        </div>
        <p className='text-xs text-muted-foreground'>
            Don&apos;t have an acoount <p className='text-sky-600 font-semibold hover:underline cursor-pointer'>SignUp</p>
        </p>

      </CardContent>
    </Card>
  )
}

export default SignInCard
