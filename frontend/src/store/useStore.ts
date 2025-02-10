import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { Parcel, User } from "@/types/types"

interface StoreState {
    user: User | null;
    setUser: (user: User) => void;
    parcels: Parcel[];
    setParcels: (parcels: Parcel[]) => void;
    addParcel: (parcel: Parcel) => void;
}

export const useStore = create<StoreState>()(
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