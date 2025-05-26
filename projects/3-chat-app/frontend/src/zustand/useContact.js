import { create } from "zustand";

const useContact = create((set) => ({
  selectedContact: null,
  setSelectedContact: (selectedContact) => set({ selectedContact }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useContact;
