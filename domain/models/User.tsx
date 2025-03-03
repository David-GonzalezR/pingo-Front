import { Role } from "react-native";


export interface User {
    id?:                 number;
    name:               string;
    lastname:           string;
    email:              string;
    phone:              string;
    password?:           string;
    image?:              null;
    notification_token?: null;  
    roles?:              Role[];
}

