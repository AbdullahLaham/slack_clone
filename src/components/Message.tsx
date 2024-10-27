import React from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'
interface MessageProps {
    id: Id<"messages">,
    memberId: Id<"members">,
    authorImage?: string;
    authorName?: string;
    isAuthor?: boolean;
    reactions?: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[]
    }>;
    body: Doc<"messages">["body"];
    image?: string | null;
    createdAt: Doc<"messages">["_creationTime"]
    updatedAt: Doc<"messages">["updatedAt"]
    isEditing: boolean;
    setEditingId: (id: Id<'messages'> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number
}
const Message = ({id, memberId, authorImage, authorName="Member", isAuthor, reactions, body,image,createdAt,updatedAt,isEditing,setEditingId,isCompact,hideThreadButton,threadCount,threadImage,threadTimestamp}: MessageProps) => {
    return (
        <Renderer value={body} />
    )
}

export default Message;


