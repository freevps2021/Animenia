import { Component, OnInit } from '@angular/core';
import { UserDataService } from './shared/user-data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public userService: UserDataService, public router: Router){
 
  }
  id:string;
  authUser:any;
  isLoggedIn;
  payload;
  ngOnInit(){
    this.setAuthentication();
   
  }

  setAuthentication(){
      // check first for login status..
        this.userService.currentLoginStatus.subscribe(status => this.isLoggedIn = status);
        if(this.userService.checkAuth()){
          this.isLoggedIn = true;
          this.userService.setLoginstatus(true);
        // get authenticated user and share its id with siblings.
        this.userService.getAuthUser().subscribe(auth =>{
          this.payload = auth;
          this.id = this.payload.user._id;
          this.authUser = this.payload.user;
          this.userService.changeUser(this.authUser);
          console.log(this.authUser);
        })
        }else{
          this.isLoggedIn = false;
          this.router.navigate(['/login']);
        }
     
 
  

}
}
