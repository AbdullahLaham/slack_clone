
"use client"

import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useParams } from 'next/navigation'
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';

const page = () => {
    const {workspaceId} = useParams();

    const {data, isLoading} = useGetWorkspace({id: workspaceId as Id<'workspaces'>});

  return (
    <div>
      d {JSON.stringify(data)}
    </div>
  )
}

export default page
