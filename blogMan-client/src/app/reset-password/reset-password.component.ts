import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(public userDataService: UserDataService, public router: Router, public route: ActivatedRoute) { }
  token: string;
  password: string;
  passwordConfirmation: string;

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
  }

  resetPassword(){
    const data = {
       newPassword: this.password,
       passwordConfirmation: this.passwordConfirmation,
       token: this.token
      };
    this.userDataService.resetPassword(data).subscribe(res => {
      if(res.success){
        console.log(res.message);
      }else{
        console.log(res);
      }
    })
  }

}
