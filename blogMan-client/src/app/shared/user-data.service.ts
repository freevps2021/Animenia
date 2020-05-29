import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { User} from './user';
import 'rxjs/add/operator/map';
@Injectable()
export class UserDataService {

  constructor(public http: HttpClient) { }
  // share current authenticated user 
  user = new BehaviorSubject('default message');
  currentUser = this.user.asObservable();

  // listen to changes of the user-id..
  changeUser(user:any){
    this.user.next(user);
  }

  // share login state
  loginStatus= new BehaviorSubject(false);
  currentLoginStatus = this.loginStatus.asObservable();
  // change login status  and share it with other compoenents
  setLoginstatus(isLoggedIn){
    this.loginStatus.next(isLoggedIn);
  }

  // share posting state
  postingStatus = new BehaviorSubject(false);
  isPosting = this.postingStatus.asObservable();
  
  // change posting state
    setPostingState(state:boolean){
      this.postingStatus.next(state);
    }
  // register user in the database
  register(user:User):any{
    return this.http.post<User>('http://localhost:3000/auth/register', user).map(result =>{
      return result;
    });
  }

  // verify account through email

  verify(token: string):any{
     return this.http.post(`http://localhost:3000/auth/verify-account/${token}`, null);
  }

  // forgot password
  forgotPassword(email: string):any{
    return this.http.post(`http://localhost:3000/auth/forgot-password`, {email: email});
 }

  // reset password
  resetPassword(data: object):any{
    return this.http.post(`http://localhost:3000/auth/reset-password`, data);
 }

  // send login data to the server...
  login(loginData):any{
    return this.http.post('http://localhost:3000/auth/login', loginData);
  }


// get the token and store it in the localstorage
  setAuth(token:any){
    if(localStorage.getItem('blogman_token') !== null){
      localStorage.setItem('blogman_token', token);
    }else{
      localStorage.removeItem('blogman_token');
      localStorage.setItem('blogman_token', token);

    }
    
  }

// logout through deleting token from localstorage
  logOut(){
    const token = localStorage.getItem('blogman_token');
    if(token !== null){
      localStorage.removeItem('blogman_token');
      this.setLoginstatus(false);
      this.changeUser(null);
    }
  }

// check if user is authenticated through token in the localstorage
  checkAuth(){
    const token = localStorage.getItem('blogman_token');     
    if(token !== null){
      return true;
    }else{
      return false;
    }
 
  }

// get token from localstorage
  getToken(){
    const token = localStorage.getItem('blogman_token');
    return token;
  }

// get user by the given id param
  getUserById(id:string){
    const headers = new HttpHeaders({'authorization':`Bearer ${this.getToken()}`});
   this.http.get<User>(`http://localhost:3000/users/${id}`, {headers : headers}).map(data=>{
    return data;
    });
  }

// get authenticated user
  getAuthUser(){
    const headers = new HttpHeaders({'authorization':`Bearer ${this.getToken()}`});
    return this.http.get<User>(`http://localhost:3000/users/auth-user`, {headers : headers});
  }
}
