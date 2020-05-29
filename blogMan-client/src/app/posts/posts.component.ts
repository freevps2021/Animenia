import { Component, OnInit, OnChanges, Input, Output } from '@angular/core';
import { DataService } from '../data.service';
import { UserDataService} from '../shared/user-data.service';
import { Observable} from 'rxjs/Observable';
import { Post } from '../shared/post';
import { Comment } from '../shared/comment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../shared/user';
import { Response } from '../shared/response';
import { UserSchema } from '../shared/user-class';
import { post } from '../../../node_modules/@types/selenium-webdriver/http';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  id:string;
  posts;
  comments:Comment[];
  postsNum: Number;
  newComment:string;
  authUser;
  editingPost:boolean = false;
  editingContent:string;
  repling:boolean = false;
  newReply:string;
  sharing: boolean = false;
  sharedPostContent: string = ' ';
  constructor(public dataService: DataService, public userService:UserDataService, public router: Router) {

   }


  ngOnInit() {
    this.loadPosts();
    this.userService.currentUser.subscribe(user => this.authUser = user);
    console.log(this.authUser);
    this.userService.isPosting.subscribe(state =>{
      if(state){
        this.loadPosts();
      }
    })
    }

loadPosts(){
  this.dataService.loadPosts().subscribe(res => {
    if(!res.success && res.status == 401){
      this.router.navigate(['/login']);

    }else{
      this.posts = res.galaxyPosts;
    //  console.log(res.galaxyPosts);
    }
    
  
        
  }, err=>{
    if(err.status== 403){
      this.router.navigate(['/login']);

    }
  });
}
likePost(id:string){
 
  this.dataService.like(id).subscribe(res=>{
    if(res.success){
      this.loadPosts();
    }else{
      console.error(res.err);
    }
  })
}
  
dislikePost(id: string){
 
  this.dataService.dislike(id).subscribe(res=>{
    if(res.success){
      this.loadPosts();
    }else{
      console.error(res);
    }

  })
}

  removePost(id:string){
    this.dataService.deletePost(id).subscribe(res=>{
        if(res.success){
        this.loadPosts();
      }else{
        console.error(res);
      }
    
    })
  }

  share(id:string){
    const sharedPost={
      hasMedia:false,
      content: this.sharedPostContent,
      created_at: new Date()
    }
    this.dataService.sharePost(id, sharedPost).subscribe(res=>{
      if(res.success){
        this.loadPosts();
      }else{
        console.error(res);

      }
    })
  }

  // Edit operations..
  startEdit(){
    this.editingPost = true;
  }

  cancelEdit(){
    this.editingPost = false;
    this.editingContent = '';

  }
  
  editPost(id:string){
    this.dataService.editPost(id, this.editingContent).subscribe(res=>{
      if(res.success){
        this.editingPost= false;
        this.editingContent= '';
        this.loadPosts();
      }else{
        console.error(res);
      }
    })
  }

  addComment(id:string){
    const comment={
      content: this.newComment,
      created_at: new Date()
  
    }
    this.dataService.addComment(id, comment).subscribe(data =>{
      
      this.loadPosts();
    })
    this.newComment='';
  }

  deleteComment(postId, commentId){
    this.dataService.deleteComment(postId, commentId).subscribe(res =>{
      if(res.success){
        this.loadPosts();
      }else{
        console.error(res);
      } 
    })
  }

 // start reply
 startReply(){
   this.repling = true;
 }
 
  //add reply to comment
  reply(id:string){
    const reply={
      reply: this.newReply,
      created_at: new Date()
    }
    this.dataService.reply(id, reply).subscribe(res=>{
      if(res.success){
        this.repling = false;
        this.newReply = '';
        this.loadPosts();
      }else{
        console.error(res);
      }
    })
  }

  // like reply
  likeReply(id:string){
    this.dataService.likeReply(id).subscribe(res=>{
      res.success? this.loadPosts() : console.error(res);
    })
  }

   // like reply
   dislikeReply(id:string){
    this.dataService.dislikeReply(id).subscribe(res=>{
      res.success? this.loadPosts() : console.error(res);
    })
  }

 // remove reply
  delReply(id:string, comment_id:string){
    const comment ={
      id: comment_id
    }
    this.dataService.delReply(id, comment).subscribe(res=>{
        this.loadPosts();
      
    })
  }

}
