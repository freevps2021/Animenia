import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

  constructor(public authService: UserDataService, public router: Router, public route: ActivatedRoute) { }
  token: string;

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.verify();
  }

  verify(){
    this.authService.verify(this.token).subscribe(res => {
      if(res.success){
        this.router.navigate(['/login']);
      }
    });
  }
}
