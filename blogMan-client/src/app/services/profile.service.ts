import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ Observable } from 'rxjs/Observable';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import {map} from 'rxjs/operators';

@Injectable()
export class ProfileService {

  constructor(public http : HttpClient, public userService: UserDataService, public dataService: DataService ) { }
  token: string;
  
  initProfile(id:string, profile){
    return this.http.post(`http://localhost:3000/users/${id}/initializeProfile`, profile);
  }

  getProfile(id: string){
    return this.http.post(`http://localhost:3000/users/${id}/profile`, null);
  }
  
  /*
  
  getUserPosts(id:string){
    return this.http.get(`http://localhost:3000/users/${id}/posts`);
  }
*/
  deletePost(id:string){
    this.token= this.userService.getToken();
    const headers = new HttpHeaders({'authorization':`Bearer ${this.token}`, 'Content-Type':'application/json'});
    return this.http.delete(`http://localhost:3000/posts/${id}/delete-post`, {
      headers : headers,
      responseType: 'json'
    });
  }

  sendFriendRequest(reciever_id:string){
    return this.http.post(`http://localhost:3000/friendship/${reciever_id}/nakama-request`, null);
  }

  acceptFriendRequest(request_id:string){
    return this.http.post(`http://localhost:3000/friendship/${request_id}/accept`, null);
  }

  declineFriendRequest(request_id:string){
    return this.http.post(`http://localhost:3000/friendship/${request_id}/decline`,null);
  }

  deleteFriend(friend_id:string){
    return this.http.post(`http://localhost:3000/friendship/${friend_id}/delete`, null);
  }

  uploadAvatar(auth_id:string, uploadedFile:File){
    this.token= this.userService.getToken();
    const headers = new HttpHeaders({'authorization':`Bearer ${this.token}`});
    const formData: FormData = new FormData();
    formData.append('profile', uploadedFile, uploadedFile.name);
    return this.http.post(`http://localhost:3000/users/${auth_id}/upload-avatar`, formData, { 
    headers : headers,
    responseType: 'json'});
  }

  getAvatar(auth_id:string, url):Observable<Blob>{
    this.token= this.userService.getToken();
    const headers = new HttpHeaders({'authorization':`Bearer ${this.token}`});
    return this.http.post(url, {auth_id:auth_id},{headers, responseType:'blob'});
  }
}
