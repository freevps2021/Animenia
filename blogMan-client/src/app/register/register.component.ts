import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import { User} from '../shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public usering: UserDataService, public data: DataService, public router: Router) { }

  ngOnInit() {
  }
  id: string;
  user:User={
  username:'',
  email:'',
  //gender:'',
  password:'',
  passwordConfirm:'',
  autoLogin: true,
  created_at: new Date
}
authData:any;
registerUser(){
  console.log(this.user);
  return this.usering.register(this.user).subscribe(res =>{
    if(res.success){
        console.log(res.message);
    }else{
      console.error(res.errors);
    }
    /*
    if(authData !== null){
      console.log(authData);
      this.authData = authData;
      const token = this.authData.token;
      this.id = this.authData.user._id;
      this.usering.changeUser(this.authData.user);

    if(token !==''){
      this.usering.setAuth(token);
      this.usering.setLoginstatus(true);
    }
    this.router.navigate(['user/'+ this.id + '/initProfile']);

    }
    */

  }, err=>{
    console.log(err);
    this.router.navigate(['/register']);
  });
}

}
