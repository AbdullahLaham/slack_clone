import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMemeber } from '../api/useGetMember'
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronDown, Loader2, MailIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuTrigger, DropdownMenuRadioItem} from '@/components/ui/dropdown-menu';

import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUpdateMember } from '../api/useUpdateMember';
import { useRemoveMember } from '../api/useRemoveMember';
import useCurrentMemeber from '../api/useCurrentMemeber';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useConfirm from '@/hooks/useConfirm';
interface ProfileProps {
  memberId: Id<"members">,
  onClose: () => void,
}
const Profile = ({ memberId, onClose }: ProfileProps) => {
  // router
  const router = useRouter();
  const [LeaveDialog, ConfirmLeave] = useConfirm("leave workspace", "are you sure you want to leave this workspace");
  const [RemoveDialog, ConfirmRemove] = useConfirm("remove member", "are you sure you want to remove this member ");
  const [UpdateDialog, ConfirmUpdate] = useConfirm("update member", "are you sure you want to update this member role");
  const {workspaceId} = useParams();
  const {data: currentMember, isLoading: loadingCurrentMember} = useCurrentMemeber({workspaceId: workspaceId as Id<"workspaces">});
  const { data: member, isLoading: memberLoading } = useGetMemeber({ memberId });
  const {mutate: updateMember, isPending: updatingMember} = useUpdateMember();
  const {mutate: removeMember, isPending: removingMember} = useRemoveMember();
  const onRemove = async () => {
    const ok = await ConfirmRemove();
    if (!ok) return;
    removeMember({id: memberId}, {
      onSuccess: () => {
        toast.success("role changed");
        router.replace('/')
        onClose();
      }, onError: () => {
        toast.success("failed to change role");
      }
    })
  }
  const onLeave = async () => {
    const ok = await ConfirmLeave();
    if (!ok) return;
    removeMember({id: memberId}, {
      onSuccess: () => {
        toast.success("you left the workspace");
        router.replace('/')
        onClose();
      }, onError: () => {
        toast.success("failed to leave the workspace");
      }
    })
  }
  const onRoleChanged = async (role: 'admin' | 'member') => {
    const ok = await ConfirmUpdate();
    if (!ok) return;

    updateMember({id: memberId, role}, {
      onSuccess: () => {
        toast.success("you left the workspace");
        onClose();
      }, onError: () => {
        toast.success("failed to leave the workspace");
      }
    })
  }

  if (memberLoading || loadingCurrentMember) {
    return (
      
      <div className='flex flex-col h-full'>
        <div className='h-[49px] flex justify-between p-4 items-center border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className='size-5 stroke-[1.5] ' />
          </Button>


        </div>
        <div className='flex-1 flex items-center justify-center'>
          <Loader2 className='animate-spin size-6 text-muted-foreground' />

        </div>
      </div>
    )
  }
  if (!member) {
    <div className='h-full flex flex-col'>
      <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <p className='text-lg font-bold'>Profile</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
          <XIcon className='size-5 stroke-[1.5] ' />
        </Button>

      </div>
      <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
          <AlertTriangle className='animate-spin size-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Profile not found</p>

        </div>

      </div>

    </div>
  }
  return (
  <>
  <LeaveDialog />
  <RemoveDialog />
  <UpdateDialog />
    <div className='flex flex-col h-full'>
      <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <p className='text-lg font-bold'>Profile</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
          <XIcon className='size-5 stroke-[1.5] ' />
        </Button>


      </div>
      <div className='flex flex-col items-center justify-center'>
        <Avatar className='rounded-md max-w-[256px] max-h-[256px] size-full  '>
          <AvatarImage className='size-5 rounded-md' src={member?.user.image} />
          <AvatarFallback className='aspect-square rounded-md bg-sky-500  flex items-center justify-center text-white text-6xl'>{member?.user?.name?.charAt(0).toUpperCase() ?? "M"}</AvatarFallback>
        </Avatar>

      </div>
      <div className='flex flex-col p-4'>
        <p className='text-xl font-bold'>{member?.user.name}</p>
        {currentMember?.role == 'admin' && currentMember._id !== memberId ? (
          <div>
            <Button variant={'outline'} className='w-full capitalize'>
              {member?.role} <ChevronDown className='size-4 ml-2' />
            </Button>
            <Button onClick={onRemove} variant={'outline'} className='w-full capitalize'>
              Remove
            </Button>
          </div>

        ): currentMember?.role !== 'admin' && currentMember?._id == memberId ? (
          <Button onClick={onLeave} variant={'outline'} className='w-full capitalize mt-4'>
              Leave
            </Button>

        ) : null}
      </div>
      <Separator />
      <div className='flex flex-col p-4'>
        <p className='text-sm font-bold mb-4'>Contact Information</p>
        <div className='flex items-center gap-2'>
          <div className='size-9 bg-muted flex items-center justify-center'>
            <MailIcon className='size-4 ' />
          </div>
          <div className='flex flex-col'>
            <p className='text-[13px] font-semibold text-muted-foreground'>Email Address</p>
            <Link href={`mailto:${member?.user.email}`} className='text-sm hover:underline text-[#1264a3] '>{member?.user.email}</Link>
          </div>

         
        </div>

      </div>
    </div></>
  )
}

export default Profile
