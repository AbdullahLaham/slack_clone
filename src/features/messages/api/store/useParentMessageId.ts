"use client"

import {parseAsBoolean, useQueryState} from 'nuqs';


export const useParentMessageId = () => {
    return useQueryState("parentMessageId");
}
