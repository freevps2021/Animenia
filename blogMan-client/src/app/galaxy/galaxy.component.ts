import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galaxy',
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.css']
})
export class GalaxyComponent implements OnInit {

  constructor(private userService: UserDataService, private router: Router) { }
  id:string;
  payload:any;
  authUser;
  isLoggedIn;

  ngOnInit() {
   
  }

}
