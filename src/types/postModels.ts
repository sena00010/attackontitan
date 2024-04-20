export interface Post {
    //todo types
    id: string;
    contentText: string;
    contextPhoto: any[];
    authorInfos: {
        authorName: string;
        authorProfilePhoto: {
            url: string;
        };
    };
    createdAt: string;
    authorID: string;
    isLiked: boolean;
    _count: {
        likes: number;
        comments: number;
        pins: number;
    };
    comments: Comment[];
    likes: Like[];
}

export interface Comment {
    id: string;
    createdAt: string;
    authorID: string;
    content: string;
    postID: string;
    authorInfos: {
        authorName: string;
        authorProfilePhoto?: {
            url: string;
        };
    };
}

export interface Like {
    id: string;
    createdAt: string;
    userID: string;
    postID: string;
    authorInfos: {
        authorName: string;
        authorProfilePhoto?: [];
    };
}
