"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';

/**
 * Hook to manage the `profileId` query parameter.
 */
export const useProfileId = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [profileId, setProfileId] = useState<Id<"members"> | null>(null);

    // Synchronize state with the URL query parameter
    useEffect(() => {
        const id = searchParams.get('profileId');
        setProfileId( null);
    }, [searchParams]);

    // Update the query parameter in the URL
    const setQuery = (newValue: Id<"members"> | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newValue) {
            params.set('profileId', newValue);
        } else {
            params.delete('profileId');
        }
        router.push(`?${params.toString()}`);
        setProfileId(newValue);
    };

    return [profileId, setQuery] as const;
};
