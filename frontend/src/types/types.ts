interface User {
    id: string;
    name: string;
    email: string;
}

interface Parcel {
    id: string;
    description: string;
    status: string;
}

export type { User, Parcel, };