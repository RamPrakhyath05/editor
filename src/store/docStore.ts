import { create } from 'zustand'

type DocState = {
  docName: string | null
  docList: string[]
  setDocName: (name: string | null) => void
  setDocList: (list: string[]) => void
  addToDocList: (name: string) => void
}

export const useDocStore = create<DocState>((set) => ({
  docName: null,
  docList: [],
  setDocName: (name) => set({ docName: name }),
  setDocList: (list) => set({ docList: list }),
  addToDocList: (name) =>
    set((state) => ({
      docList: [...new Set([...state.docList, name])],
    })),
}))
