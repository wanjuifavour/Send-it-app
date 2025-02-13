import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export const useStore = create()(
    devtools(
        persist(
            (set) => ({
                user: null,
                setUser: (user) => set({ user }),
                parcels: [],
                setParcels: (parcels) => set({ parcels }),
                addParcel: (parcel) => set((state) => ({ parcels: [...state.parcels, parcel] })),
            }),
            {
                name: "send-it-storage",
            },
        ),
    ),
)