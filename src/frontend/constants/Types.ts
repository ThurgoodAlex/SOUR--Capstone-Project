import { ImageSourcePropType, TextProps, ViewProps } from "react-native";

export type Post = {
    id: number;
    // data: TexImageSource;
    data: ImageSourcePropType | undefined;
    user: string;
    type: string;
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
