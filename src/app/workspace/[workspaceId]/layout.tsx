"use client"
import React from 'react'
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import WorkspaceSidebar from './WorkspaceSidebar';
import { usePanel } from '@/hooks/usePanel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/Thread';
import Profile from '@/features/members/components/Profile';
const WorkspaceLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { parentMessageId, profileId, onClose } = usePanel();
  console.log('pppppppppppppppppptttttttttttttttt', parentMessageId)
  const showPanel = !!parentMessageId || !!profileId;
  
  return (
    <div className='h-full mt-0'>
      <Toolbar />
      <div className='flex h-[92.5vh]'>
        <Sidebar />
        <ResizablePanelGroup direction='horizontal' autoSaveId={'ca-workspace-layout'}>
          <ResizablePanel defaultSize={20} minSize={11} className='bg-[#5e2c5f]'>
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} >
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29} >
                {parentMessageId ? (
                  <div>
                    <Thread messageId={parentMessageId as Id<"messages">} onClose={onClose} />
                  </div>

                ) : profileId ? (
                  <div>
                    <Profile memberId={profileId} onClose={() => {}} />
                  </div>

                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <Loader className='size-5 animate-spin text-muted-foreground' />
                  </div>
                )}

              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

      </div>

    </div>
  )
}

export default WorkspaceLayout


// npx convex deploy --cmd 'npm run build'

// CONVEX_DEPLOY_KEY: prod:colorless-mockingbird-505|eyJ2MiI6IjM3OTljZjM2NjA2OTRkNGI5ZGQ2OTkxMWMzMDkxN2ZhIn0=
