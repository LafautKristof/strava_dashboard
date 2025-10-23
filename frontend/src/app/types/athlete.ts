export type Athlete = {
    athlete_type: number;
    badge_type_id: number;
    bikes: Bikes[];
    bio: string;
    blocked: boolean;
    can_follow: boolean;
    city: string;
    clubs: Bikes[];
    country: string;
    created_at: string;
    date_preference: string;
    firstname: string;
    follower: string;
    follower_count: number;
    friends: string[];
    friend_count: number;
    ftp: number;
    id: number;
    lastname: string;
    measurement_preference: string;
    postable_clubs_count: number;
    premium: boolean;
    profile: string;
    profile_medium: string;
    resource_state: number;
    sex: string;
    shoes: Shoes[];
    state: string;
    summit: boolean;
    updated_at: string;
    username: string;
    weight: number;
};

export type Shoes = {
    converted_distance: number;
    distance: number;
    id: string;
    name: string;
    nickname: string;
    primary: boolean;
    resource_state: number;
    retired: boolean;
};

export type Bikes = {
    id: string;
    name: string;
    resource_state: number;
    retired: boolean;
    distance: number;
};
