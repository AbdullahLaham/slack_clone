import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react"
import { Id } from "../../../../convex/_generated/dataModel"
import { request } from "http"

type responseType = Id<"channels"> | null

interface Options {
    onSuccess: (data: responseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
}
interface request {
    id: Id<"channels">,
}

export const useRemoveChannel = () => {

    const [status, setStatus] = useState<null | 'success' | 'error' | 'settled' | 'pending'>(null);
    const isPending = useMemo(() => status == 'pending', [status])
    const isSuccess = useMemo(() => status == 'success', [status])
    const isError = useMemo(() => status == 'error', [status])
    const isSettled = useMemo(() => status == 'settled', [status])

    const mutation = useMutation(api.channels.remove);
    const mutate = useCallback(async ({id}: request, options?: Options) => {
            try {
                setStatus('pending')
                const response = await mutation({id});
                options?.onSuccess(response);
                return response;


            } catch (error) {
                setStatus('error')
                if (!options?.onError) return
                options?.onError(error as Error);
                throw error;
            }finally {
                setStatus('settled')
            }
        },
        []);
        return {mutate, isError, isPending, isSettled, isSuccess};
}