export type Athlete = {
    id: number;
    bikes: [];
    bio: string;
    city: string;
    country: string;
    created_at: string;
    firstname: string;
    follower_count: number;
    friend_count: number;
    lastname: string;
    profile: string;
    shoes: Shoe[];
    state: string;
    total_activities: number;
};

export type Shoe = {
    id: number;
    name: string;
    distance: number;
    converted_distance: number;
    nickname: string;
    created_at: string;
    updated_at: string;
    retired: boolean;
};
