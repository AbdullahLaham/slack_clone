import React from 'react'
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';

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
          {children}
        </div>
      
    </div>
  )
}

export default WorkspaceLayout
