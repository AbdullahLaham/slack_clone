"use client";

import { useProfileId } from "@/features/members/store/useProfileIMemberd";
import { useParentMessageId } from "@/features/messages/store/useParentMessageId";


/**
 * Hook to manage panel state, built on top of `useParentMessageId`.
 * Provides methods to open and close the panel, and tracks the current message ID.
 */
export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const [profileId, setProfileId] = useProfileId();

    // Open the panel with a specific message ID
    const onOpenMessage = (messageId: any) => {
        setParentMessageId(messageId);
        setProfileId(null);
    };

    const onOpenProfile = (profileId: any) => {
        setProfileId(profileId);
        setParentMessageId(null)
    };

    // Close the panel by resetting the message ID
    const onClose = () => {
        setParentMessageId(null);
        setProfileId(null);
    };

    return {
        parentMessageId,
        onOpenMessage,
        onOpenProfile,
        profileId,
        onClose,
    };
};
