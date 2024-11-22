export type Post = {
    id: number;
    // data: TexImageSource;
    data: string;
    user: string;
    type: string;
};

export type GridPostsProps = {
    posts: Post[];
};