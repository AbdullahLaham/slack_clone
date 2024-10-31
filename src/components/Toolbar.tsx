import React from 'react'
interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleSubmit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    hideThreadButton?: boolean;
    handleReaction: (value: string) => void;
}
const Toolbar = ({isAuthor,isPending,handleSubmit,handleDelete,handleReaction,handleThread,hideThreadButton}: ToolbarProps) => {
    return (
        <div>

        </div>
    )
}

export default Toolbar
