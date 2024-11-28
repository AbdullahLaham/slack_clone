"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * Hook to manage the `parentMessageId` query parameter.
 */
export const useParentMessageId = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [parentMessageId, setParentMessageId] = useState<string | null>(null);

    // Synchronize state with the URL query parameter
    useEffect(() => {
        const id = searchParams.get('parentMessageId');
        setParentMessageId(id || null);
    }, [searchParams]);

    // Update the query parameter in the URL
    const setQuery = (newValue: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newValue) {
            params.set('parentMessageId', newValue);
        } else {
            params.delete('parentMessageId');
        }
        router.push(`?${params.toString()}`);
        setParentMessageId(newValue);
    };

    return [parentMessageId, setQuery] as const;
};
