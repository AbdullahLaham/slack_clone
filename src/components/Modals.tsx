"use client"
import InviteModal from '@/app/workspace/[workspaceId]/InviteModal';
import CreateChannelModal from '@/features/channels/components/CreateChannelModal';
import CreateWorkspaceModal from '@/features/workspaces/components/createWorkspaceModal';
import React, { useEffect, useState } from 'react'

const Modals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) return null
  return (
    <div>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </div>
  )
}

export default Modals
