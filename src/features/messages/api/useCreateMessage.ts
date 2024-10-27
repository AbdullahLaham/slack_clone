import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react"
import { Id } from "../../../../convex/_generated/dataModel"
import { request } from "http"

type responseType = Id<"messages">

interface Options {
    onSuccess?: (data: responseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError: true,
}
interface request {
    body: string,
    image?: Id<"_storage">,
    workspaceId: Id<'workspaces'>,
    channelId?:Id<'channels'>,
    parentMessageId?:Id<"messages">,
    conversationId?: Id<"conversations">,
}

export const useCreateMessage = () => {

    const [status, setStatus] = useState<null | 'success' | 'error' | 'settled' | 'pending'>(null);
    const isPending = useMemo(() => status == 'pending', [status])
    const isSuccess = useMemo(() => status == 'success', [status])
    const isError = useMemo(() => status == 'error', [status])
    const isSettled = useMemo(() => status == 'settled', [status])

    const mutation = useMutation(api.messages.create);
    const mutate = useCallback(async ({ body, image, workspaceId, channelId, parentMessageId, conversationId }: request, options?: Options) => {
        try {
            setStatus('pending')
            const response = await mutation({ body, image, workspaceId, channelId, parentMessageId, conversationId });
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