import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import { SpaceService } from '../services/space.service';
import { ProfileService } from '../services/profile.service';
import { User} from '../shared/user';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit {
  id: string;

  constructor(
    public userData: UserDataService,
    public dataService: DataService,
    public spaceService: SpaceService,  
    public router: Router,
    public route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    //this.launchSpaceship(this.id);
    this.getTimeline(this.id);

  }

  launchSpaceship(id:string){
    this.spaceService.launchSpaceship(id).subscribe(res => {
      console.log(res);
    })
  }

  getTimeline(id:string){
    this.spaceService.getSpaceTimeline(id).subscribe(res => {
      console.log(res);
    })
  }
}
