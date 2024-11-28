import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react"
import { Id } from "../../../../convex/_generated/dataModel"
import { request } from "http"
import { useRouter } from "next/navigation"

type responseType = Id<"reactions">

interface Options {
    onSuccess?: (data: responseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError?: true,
}
interface request {
    value: any,
    messageId: Id<"messages">,
}

export const useToggleReaction = () => {
    const router = useRouter();
    const [status, setStatus] = useState<null | 'success' | 'error' | 'settled' | 'pending'>(null);
    const isPending = useMemo(() => status == 'pending', [status])
    const isSuccess = useMemo(() => status == 'success', [status])
    const isError = useMemo(() => status == 'error', [status])
    const isSettled = useMemo(() => status == 'settled', [status])

    const mutation = useMutation(api.reactions.toggle);
    const mutate = useCallback(async ({ value, messageId }: request, options?: Options) => {
        try {
            setStatus('pending')
            const response = await mutation({ messageId, value: value?.native || value });
            // console.log(response, 'reaction')
            // options?.onSuccess(response);
            return response;


        } catch (error) {
            setStatus('error')
            // options?.onError(error as Error);
            throw error;
        } finally {
            setStatus('settled')
        }
    },
        []);
    return { mutate, isError, isPending, isSettled, isSuccess };
}