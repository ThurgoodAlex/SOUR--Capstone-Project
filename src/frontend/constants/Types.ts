import { ImageSourcePropType, TextProps, ViewProps } from "react-native";

export type Post = {
    id: number;
    createdDate: Date;

    seller: User;
    title: string;
    description: string;
    brand: string;
    condition: string;
    size: string;
    gender: string;
    coverImage: ImageSourcePropType | undefined;
    price: string;

    isSold: boolean;
    isListing: boolean;
  
};

// export type Listing = {
//     id:number;
//     createdDate: Date;

//     title: string;
//     price: string;
//     description: string;
//     size: string;

//     seller: User;
// };

export type User = {
    firstname: string;
    lastname: string;
    username: string;
    id:number;
    profilePicture?:string | '../assets/images/profile_pic.jpg';
    isSeller: boolean;
    email: string;
    bio: string;
};



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




  