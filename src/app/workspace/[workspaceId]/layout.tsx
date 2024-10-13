import React from 'react'
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable'
import WorkspaceSidebar from './WorkspaceSidebar';
const WorkspaceLayout = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
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
          </ResizablePanelGroup>
          
        </div>
      
    </div>
  )
}

export default WorkspaceLayout
