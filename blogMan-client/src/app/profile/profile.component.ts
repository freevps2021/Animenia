import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import { ProfileService } from '../services/profile.service';
import { User} from '../shared/user';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(
    public usering: UserDataService,
    public data: DataService, 
    public router: Router,
    public route: ActivatedRoute, 
    public profileService: ProfileService 
  ) {}

  id: string;
  profile;
  posts:Array<any>;
  newComment;
  authUser;
  isFriend;
  fileToUpload: File;
  avatar;
  editingPost:boolean = false;
  editingContent:string;
  repling:boolean = false;
  newReply:string;
  sharing: boolean = false;
  sharedPostContent:string = ' ';

  ngOnInit() {
    // init the id as the params id.
    this.id = this.route.snapshot.params['id'];
   this.getAuthUser();
    
    this.getProfile();

  

    this.usering.changeUser(this.authUser);
    

    // if router emits a change then reset the id to the new one in the route & get profile
    
    this.router.events.subscribe(e =>{
      if(e instanceof NavigationEnd){
          this.id = this.route.snapshot.params['id'];
           this.getProfile();
         }
    })
    
    
    // get posting state to reload if the user posted at the new post comp.
    
    this.usering.isPosting.subscribe(state =>{
      if(state){
        this.getProfile();
      }
    });
    
  }
  ngOnDestroy(){
   // this.getProfile().unsubscribe();
  }

  // get shared auth user from the service
  getAuthUser(){
    this.usering.currentUser.subscribe( auth => this.authUser = auth);
  }

  genImageOfBlob(image:Blob){
    let fileReader = new FileReader();
    fileReader.addEventListener('load',()=>{
      this.avatar= fileReader.result;
    }, false);
    if(image){
      fileReader.readAsDataURL(image);
    }
  }

    // get a profile of a user..
  getProfile(){
    this.usering.currentUser.subscribe( auth => {
      this.authUser = auth;
      if(this.authUser !== null){
        return this.profileService.getProfile(this.id).subscribe(data => {
          console.log(this.authUser._id);
          console.log(data);
          this.profile = data;
          this.posts = this.profile.profile.posts;
          /*
          if(this.profile.profile.avatar_url){
            this.profileService.getAvatar(this.authUser._id,this.profile.profile.avatar_url).subscribe(avatar =>{
              this.genImageOfBlob(avatar);
            })
          }
          */
          
          if(this.profile.profile.nakamas){
            if(this.profile.profile.nakamas.indexOf(this.authUser._id) > -1){
              this.isFriend = true;
            }else{
            this.isFriend = false;
            }
          }
        })
      }
     
     });
     
    
    
  }

 uploadAvatar(files: FileList){
   this.fileToUpload = files.item(0);
   this.profileService.uploadAvatar(this.authUser._id,this.fileToUpload).subscribe(res=>{
     this.getProfile();
   })
 }
 

  likePost(id: string){
    this.data.like(id).subscribe(res=>{
      this.getProfile();
    })
  }


    
  dislikePost(id: string){
    this.data.dislike(id).subscribe(res=>{
      this.getProfile();
  
    })
  }


    removePost(id:string){
      console.log(id);
      this.data.deletePost(id).subscribe(post=>{
        this.getProfile();
      })
    }


    share(id:string){
      const sharedPost={
        hasMedia:false,
        content: this.sharedPostContent,
        created_at: new Date()
      }
      this.data.sharePost(id, sharedPost).subscribe(res=>{
        if(res.success){
          this.getProfile();
        }else{
          console.error(res);
  
        }
      })
    }


    addComment(id:string){
      const comment={
        content: this.newComment,
        user: this.authUser,
        created_at: new Date()
    
      }
      this.data.addComment(id, comment).subscribe(data =>{
        
        this.getProfile();
      })
      this.newComment='';
    }
  
    deleteComment(postId, commentId){
      console.log(commentId);
      this.data.deleteComment(postId, commentId).subscribe(res =>{
        this.getProfile();
   
      })
    }

    startEdit(){
      this.editingPost = true;
    }
  
    cancelEdit(){
      this.editingPost = false;
      this.editingContent = '';
  
    }
    
    editPost(id:string){
      this.data.editPost(id, this.editingContent).subscribe(res=>{
        if(res.success){
          this.editingPost= false;
          this.editingContent= '';
          this.getProfile();
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
   this.data.reply(id, reply).subscribe(res=>{
     if(res.success){
       this.repling = false;
       this.newReply = '';
       this.getProfile();
     }else{
       console.error(res);
     }
   })
 }

 // like reply
 likeReply(id:string){
   this.data.likeReply(id).subscribe(res=>{
     res.success? this.getProfile() : console.error(res);
   })
 }

  // like reply
  dislikeReply(id:string){
   this.data.dislikeReply(id).subscribe(res=>{
     res.success? this.getProfile() : console.error(res);
   })
 }

// remove reply
 delReply(id:string, comment_id:string){
   const comment ={
     id: comment_id
   }
   this.data.delReply(id, comment).subscribe(res=>{
       this.getProfile();
     
   })
 }
 
   sendFriendRequest(){
     this.profileService.sendFriendRequest(this.profile.profile.userId).subscribe(res =>{
      console.log(res);
     }, err =>{
       console.log(err);
     })
   }

   acceptFriendRequest(request_id:string, sender_id:string){
    this.profileService.acceptFriendRequest(request_id).subscribe(res=>{
      this.getProfile();
    })
   }

   declineFriendRequest(request_id:string, sender_id:string){
    this.profileService.declineFriendRequest(request_id).subscribe(res=>{
      this.getProfile();
    })
   }

   deleteFriend(friend_id:string){
    this.profileService.deleteFriend(friend_id).subscribe(state=>{
          this.isFriend=false;
          this.getProfile();
        
      
      
    })
   }
  
}
