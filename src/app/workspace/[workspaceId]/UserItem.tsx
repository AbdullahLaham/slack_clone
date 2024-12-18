import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { cva, VariantProps } from 'class-variance-authority'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Avatar , AvatarFallback, AvatarImage} from '@/components/ui/avatar'
interface UserItemProps {
    id: Id<"members">,
    label?: string,
    image?: string,
    variant?: VariantProps<typeof userItemVariants>["variant"]
}
const userItemVariants = cva(
    "flex items-center justify-start gap-1.5 font-normal h-7 px-4 text-sm overflow-hidden",
    {
      variants: {
        variant: {
          default: "text-[#f9edffcc]",
          active: "text-[#481349] bg-white/90 "
        },
        defaultVariants: {
          variant: 'default'
        }
      }
    }
  )
const UserItem = ({id, label, image, variant}: UserItemProps) => {
    const {workspaceId} = useParams();
  return (
    <Button variant={'transparent'} className={cn(userItemVariants({variant}))} size={'sm'} asChild >
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
            <Avatar className='rounded-md size-5 mr-1'>
                <AvatarImage className='size-5 rounded-md' src={image}  />
                <AvatarFallback className='size-5 rounded-md bg-sky-500  flex items-center justify-center text-white text-xs'>{label?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className='text-sm truncate'>{label}</span>
        </Link>
    </Button>
  )
}

export default UserItem
