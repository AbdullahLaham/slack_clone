"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Hook to manage the `parentMessageId` query parameter in the URL.
 * Synchronizes state with the query parameter and provides a setter.
 */
export const useParentMessageId = (): [string | null, (newValue: string | null) => void] => {
    const router = useRouter();
    const [parentMessageId, setParentMessageId] = useState<string | null>(null);


    // Synchronize state with the query parameter when the router is ready
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.parentMessageId as string | undefined;
            setParentMessageId(id || null);
        }
    }, [router.query, router.isReady]);

    // Update the query parameter and local state
    const setQuery = (newValue: string | null) => {
        const updatedQuery = { ...router.query, parentMessageId: newValue || undefined };
        router.push({ pathname: router.pathname, query: updatedQuery }, undefined, { shallow: true });
        setParentMessageId(newValue);
    };

    return [parentMessageId, setQuery];
};
