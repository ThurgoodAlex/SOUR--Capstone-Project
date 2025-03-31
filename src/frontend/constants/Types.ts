import { ImageSourcePropType, TextProps, ViewProps } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Post = {
    id: number;
    createdDate: Date;

    seller: User | null;
    title: string;
    description: string;
    brand: string;
    condition: string;
    size: string;
    gender: string;
    coverImage: ImageSourcePropType | string
    price: string;

    isSold: boolean;
    isListing: boolean;
  
};

export interface CartPost extends Post {
    cartItemId: number;
  }

export type User = {
    firstname: string;
    lastname: string;
    username: string;
    id:number;
    profilePic?:string | '../assets/images/blank_profile_pic.png';
    isSeller: boolean;
    email: string;
    bio: string;
};

export type Stats = {
    totalEarnings: Float;
    itemsSold: number;
}





export type PostFlatListProps = {
    posts: Post[];
    height: number
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

export type CartItemProps = {
    id : number,
    userID: number,
    listingID: number,
}

export type ChatData = {
    id: number;
    senderID: number;
    recipientID: number;
};

export type MessageData = {
    id: number;
    chatID: number;
    author: number;
    message: string;
    created_at: Date;
};
  
export type PostImage = {
    url: string;
    id: number;
    postID: number;
    isVideo: boolean;
  };


  export type PostImagesResponse = {
    post_id: number;
    items: PostImage[];
  };
