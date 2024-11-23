"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';

/**
 * Hook to manage the `parentMessageId` query parameter in the URL.
 * Synchronizes state with the query parameter and provides a setter.
 */
export const useProfileId = (): [Id<"members"> | null, (newValue: Id<"members"> | null) => void] => {
    const router = useRouter();
    const [profileId, setProfileId] = useState<Id<"members"> | null>(null);

    // Synchronize state with the query parameter when the router is ready
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.parentMessageId as Id<"members"> | undefined;
            setProfileId(id || null);
        }
    }, [router.query, router.isReady]);


    // Update the query parameter and local state
    const setQuery = (newValue: Id<"members"> | null) => {
        const updatedQuery = { ...router.query, parentMessageId: newValue || undefined };
        router.push({ pathname: router.pathname, query: updatedQuery }, undefined, { shallow: true });
        setProfileId(newValue);
    };

    return [profileId, setQuery];
};
