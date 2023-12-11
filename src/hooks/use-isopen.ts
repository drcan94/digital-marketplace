import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type IsOpenState = {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
};

export const useIsOpen = create<IsOpenState>()(
  persist(
    (set) => ({
      isOpen: false,
      setOpen: () =>
        set(() => {
          return { isOpen: true };
        }),
      setClose: () =>
        set(() => {
          return { isOpen: false };
        }),
    }),
    {
      name: "is-open",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
