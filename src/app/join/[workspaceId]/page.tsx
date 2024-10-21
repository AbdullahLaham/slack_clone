"use client"

import { Button } from '@/components/ui/button'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/useGetWorkspacesInfo'
import { Hash, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { useJoin } from '@/features/workspaces/api/useJoin'
import VerificationInput from 'react-verification-input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
// interface joinPageProps {
//     params: {
//         workspaceId: string
//     }
// }
const JoinPage = () => {
    const router = useRouter();
    const {workspaceId} = useParams();
    const {data, isLoading} = useGetWorkspaceInfo({id: workspaceId as Id<"workspaces">});
    const {mutate, isPending} = useJoin({workspaceId: workspaceId as Id<"workspaces">, joinCode: ""});
    const isMemeber = useMemo(() => data?.isMember , []);
    useEffect(() => {
        if (isMemeber) {
            router.push(`/workspace/${workspaceId}`)
        }
    }, [])
    const handleComplete = (value: string) => {
        mutate({workspaceId: workspaceId as Id<'workspaces'>, joinCode: value}, {
            onSuccess: (id) => {
                toast.success("workspace joined");
                router.replace(`/workspace/${id}`)
            }, onError: () => {
                toast.error("failed to join workspace")
            }
        })

    }
    if (isLoading) {
        return <div className='h-full flex items-center justify-center'>
            <Loader2 className='animate-spin size-6 text-muted-foreground' />

        </div>
    }

  return (
    <div className='h-full flex flex-col gap-y-1 items-center justify-center bg-white p-8'>
      <Hash className='size-60 text-rose-500 font-bold text-2xl' />
      <div className='flex flex-col gap-y-4 items-center justify-center bg-white max-w-md'>
        <div className='flex flex-col gap-y-2 items-center justify-center'>
            <h1 className='text-2xl font-bold'>Join {data?.name}</h1>
            <p className='text-md text-muted-foreground'>Enter the Join code</p>

        </div>
        <VerificationInput onComplete={handleComplete} length={6} autoFocus classNames={{
            container: cn('flex gap-x-2', isPending && "opacity-50 cursor-not-allowed my-0"),
            character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
        
        }} />

      </div>
      <div className='flex gap-x-4'>
        <Button size={'lg'} variant={'outline'} asChild >
            <Link href={'/'}>
            Back to Home
            </Link>

        </Button>

      </div>
    </div>
  )
}

export default JoinPage
