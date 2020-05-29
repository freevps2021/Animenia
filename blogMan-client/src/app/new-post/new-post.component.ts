import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../shared/post';
import { Comment } from '../shared/comment';
import { DataService} from '../data.service';
import { UserDataService } from '../shared/user-data.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  @Input() space: string;
  constructor(
     public dataService: DataService,
     public userData: UserDataService,
     public fb: FormBuilder,
     public cd: ChangeDetectorRef
    ) {}
    postForm: FormGroup;

 
   newPost: Post= {
    created_at: new Date(),
    content: '',
    likes: [],
    shares:[],
    comments:[],
    hasMedia:false,
    media:File
  };
  mediaUploaded:boolean;
  media:File;
  ngOnInit() {
    this.postForm = this.fb.group({
      content:'',
      media:null
    });
  }

  addMedia(files: FileList){
    // if the post contains any media
    this.media = files.item(0);
    /*
    let reader = new FileReader();
    if(files && files.length){
      console.log(files[0]);
      reader.readAsDataURL(files[0]);
      reader.onload = ()=>{
        console.log(reader.result)
        this.postForm.patchValue({
          media: reader.result
        })
        this.cd.markForCheck();

      }
    }
    */
   // this.newPost.media = files.item(0);
    //formData.append('post', this.newPost.media, this.newPost.media.name);
    this.mediaUploaded = true;
   console.log(this.media);
   
  }

  addNewPost(){
    let postData = this.postForm.value;
  
    const post ={
      content: postData.content
    }

    console.log(this.media);
    this.dataService.addPost(post, this.media).subscribe(res =>{
      console.log(res);
      this.userData.setPostingState(true);

    });
    this.newPost.content = '';
  
  }

}
