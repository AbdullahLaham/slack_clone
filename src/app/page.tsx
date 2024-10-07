"use client"

import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/AuthScreen";
import UserButton from "@/features/auth/components/UserButton";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
export default function Home() {
  // const {signOut} = useAuthActions();
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal()
  const {data, isLoading} = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id , [data]);
  
  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.push(`/workspace/${workspaceId}`)
    } else if(!open) {
      setOpen(true)

    }
  }, [workspaceId, router, isLoading, open, setOpen])
 
  
  return (
    <div >
      <UserButton />
    </div>
  );
}
