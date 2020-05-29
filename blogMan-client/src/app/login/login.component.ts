import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import { User} from '../shared/user';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public usering: UserDataService, public data: DataService, public router: Router) { }
  loggedIn:  boolean;
  id: string;
  loginData:any ={
    username:'',
    password:'',
  }
  authData:any;

  ngOnInit() {
  }
 
login(){
  return this.usering.login(this.loginData).subscribe(data =>{
    console.log(data);
    this.authData = data.authData;
    const token = data.token;
    this.id = this.authData._id;
    if(token){
      this.usering.setAuth(token);
      this.usering.setLoginstatus(true);
      this.usering.changeUser(this.authData);
      this.router.navigate(['/galaxy']);

    }
  })
}
}
