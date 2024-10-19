import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react"
import { Id } from "../../../../convex/_generated/dataModel"
import { request } from "http"

type responseType = Id<"workspaces"> | null

interface Options {
    onSuccess: (data: responseType) => void,
    onError: (error: Error) => void,
    onSettled: () => void,
}
interface request {
    workspaceId: Id<"workspaces">,
}

export const useNewJoinCode = () => {

    const [status, setStatus] = useState<null | 'success' | 'error' | 'settled' | 'pending'>(null);
    const isPending = useMemo(() => status == 'pending', [status])
    const isSuccess = useMemo(() => status == 'success', [status])
    const isError = useMemo(() => status == 'error', [status])
    const isSettled = useMemo(() => status == 'settled', [status])

    const mutation = useMutation(api.workspaces.newJoinCode);
    const mutate = useCallback(async ({workspaceId}: request, options?: Options) => {
            try {
                setStatus('pending')
                const response = await mutation({workspaceId});
                options?.onSuccess(response);
                return response;


            } catch (error) {
                setStatus('error')
                options?.onError(error as Error);
                throw error;
            }finally {
                setStatus('settled')
            }
        },
        []);
        return {mutate, isError, isPending, isSettled, isSuccess};
}