import { Comment } from './comment';

export interface Post{
    id?: String;
    isOriginal?:Boolean;
    userId?:string;
    user?: object;
    content: String;
    created_at: Date;
    likes?: Array<Object>;
    shares?:Array<Object>;
    comments?:Array<Comment>;
    hasMedia?:Boolean;
    media?: any;

}