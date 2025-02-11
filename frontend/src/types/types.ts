interface User {
    id: string;
    name: string;
    email: string;
}

interface Parcel {
    id: string;
    senderId: string;
    receiverId: string;
    pickupLocation: string;
    destination: string;
    weight: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export type { User, Parcel, };