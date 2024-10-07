"use client"
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
    </div>
  )
}

export default Modals
