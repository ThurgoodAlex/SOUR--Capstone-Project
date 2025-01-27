import { ImageSourcePropType, TextProps, ViewProps } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Post = {
    id: number;
    data: ImageSourcePropType | undefined;
    type: string;
    createdDate: Date;

    author:User;
};

export type Listing = {
    id:number;
    createdDate: Date;

    title: string;
    price: string;
    description: string;
    size: string;

    seller: User;
};

export type User = {
    firstname: string;
    lastname: string;
    username: string;
    id:number;
    profilePicture?:string | '../assets/images/profile_pic.jpg';
    isSeller: boolean;
    email: string;
};

export type Stats = {
    totalEarnings: Float;
    itemsSold: number;
}


export type GridPostsProps = {
    posts: Post[];
};

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};




  