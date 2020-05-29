export interface Comment{
    _id?: String;
    user?: any;
    content: String;
    created_at: Date;
    subComments?:Array<any>,
    likes?:Array<any>



}