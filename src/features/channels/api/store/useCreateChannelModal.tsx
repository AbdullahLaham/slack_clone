import React from 'react'
import { atom, useAtom } from 'jotai'

const modalState = atom(false);
export const useCreateChannelModal = () => {
  return useAtom(modalState)
}

