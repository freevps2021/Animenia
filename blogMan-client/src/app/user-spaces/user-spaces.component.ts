import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import { SpaceService } from '../services/space.service';
import { ProfileService } from '../services/profile.service';
import { User} from '../shared/user';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-spaces',
  templateUrl: './user-spaces.component.html',
  styleUrls: ['./user-spaces.component.css']
})
export class UserSpacesComponent implements OnInit {
  auth:any;
  subscribedSpaces;

  constructor(
    public userData: UserDataService,
    public dataService: DataService,
    public spaceService: SpaceService,  
    public router: Router,
    public route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.userData.currentUser.subscribe(auth => {
      if(auth !== null){
        this.auth = auth;
      }
    });
  }

unsubscribe(id: string){
  this.spaceService.unsubscribeSpace(id).subscribe(res => {
    if(res.success){
      console.log(res.message);
    }else{
      console.log(res.message);
    }
  })
}
 

  
  
  
}
