import React from 'react'
import Toolbar from './Toolbar';

const WorkspaceLayout = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <div className='h-full'>
        <Toolbar />
      {children}
    </div>
  )
}

export default WorkspaceLayout
