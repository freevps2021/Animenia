
export class UserSchema{
    constructor(
    
    ){}
    public created_at:Date;
    public name: String;
    public email: String;
    public friendRequests: Array<any>;
    public friends: Array<any>;
    public images:Array<any>;
    public posts:Array<any>;
    public id: String
}