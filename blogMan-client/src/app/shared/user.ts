export interface User{
    _id?: any,
    username: any,
    password:String,
    passwordConfirm?:String,
   // gender: String,
    email:String,
    autoLogin: Boolean,
    created_at: Date

}