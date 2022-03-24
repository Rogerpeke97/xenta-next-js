import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface UserType{
    created_at: Date;
    id: number;
    name: string;
    roles: string[];
    score: number;
    updated_at: Date;
    username: string;
}
