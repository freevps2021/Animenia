import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service'
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public userDataService: UserDataService) { }

  email: string;
  message : string;
  errors : any[] = [];

  ngOnInit() {
  }

  confirmEmail(){
    this.userDataService.forgotPassword(this.email).subscribe(res => {
      if(res.success){
        this.message = res.message;
        console.log(this.message);
      }else{
        let errorMsgs = res.error || res.errors || res.error.errors;

        if(errorMsgs.length){
            this.errors = [...errorMsgs];
            console.log(this.errors);
        }else{
          this.errors.push(errorMsgs);
          console.log(this.errors);

        }
        
      }
    })
  }

}
