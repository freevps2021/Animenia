import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ Observable } from 'rxjs/Observable';
import { Post } from './shared/post';
import { Comment } from './shared/comment';
import { UserDataService } from './shared/user-data.service';

import 'rxjs/add/operator/map';
@Injectable()
export class DataService {

  constructor(public http : HttpClient, public userService: UserDataService) { }
  id: String;
  payload:any;
  token:string;
  comments:Comment[];
  posts:Observable<any>

  
  loadPosts():Observable<any>{
    return this.http.get('http://localhost:3000/posts');
    
  }

  addPost(post, file):Observable<any>{
    let formData : FormData = new FormData();
    formData.append('content', post.content);
    if(file != null){
      formData.append('posts', file, file.name);

    }

    return this.http.post<Post>('http://localhost:3000/posts/new-post', formData);
  }

  sharePost(id:string, post):any{
    return this.http.post<Post>(`http://localhost:3000/posts/${id}/share`, post);
  }

  


  deletePost(id:string):Observable<any>{;
    return this.http.delete<Post>(`http://localhost:3000/posts/${id}/delete-post`);
  }

  editPost(id:string, editedContent){
    return this.http.post<any>(`http://localhost:3000/posts/${id}/edit-content`,{editedContent});
  }

  addComment(id: string, comment){
    return this.http.post(`http://localhost:3000/posts/${id}/add-comment`, comment);
  }

  //delete a comment...
  deleteComment(postId, commentId):any{
    return this.http.post(`http://localhost:3000/posts/${postId}/delete-comment`, {id: commentId});
  }

// reply on comment
reply(commentId:string, reply){;
    return this.http.post<any>(`http://localhost:3000/posts/${commentId}/add-reply`, reply);
}

// like a reply
likeReply(id:string){
  return this.http.post<any>(`http://localhost:3000/posts/${id}/like-reply`,{});  
}

// like a reply
dislikeReply(id:string){
  return this.http.post<any>(`http://localhost:3000/posts/${id}/dislike-reply`,{});  
}

// delete reply...
  delReply(id:string, comment){
    //this.token= this.userService.getToken();
    //const headers = new HttpHeaders({'authorization':`Bearer ${this.token}`, 'Content-Type':'application/json'});
    return this.http.delete<any>(`http://localhost:3000/posts/${id}/remove-reply`, comment);  
  }
  // like post
  like(id:string):any{
    return this.http.post(`http://localhost:3000/posts/${id}/like`, null);
  }

// dislike a post
dislike(id:string):any{
  return this.http.post(`http://localhost:3000/posts/${id}/dislike`, null);
}

  loadPostComments(id:string):Observable<any>{;
    return this.http.get(`http://localhost:3000/posts/${id}`);
  }
}
