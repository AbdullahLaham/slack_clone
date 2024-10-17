import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react'
import { IconType } from 'react-icons/lib';
const sidebarItemVariants = cva(
  "flex items-center justify-start gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden",
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
interface SidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType,
    variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}
const SidebarItem = ({label, id, icon: Icon, variant}: SidebarItemProps) => {
    const {workspaceId} = useParams();
    
  return (
    <Button asChild variant={'transparent'} size={'sm'} className={cn(sidebarItemVariants({variant}))}>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
      <Icon className='size-3.5 mr-1 shrink-1' />
      <span className='text-sm truncate '>{label}</span>
      </Link>
    </Button>
  )
}

export default SidebarItem
