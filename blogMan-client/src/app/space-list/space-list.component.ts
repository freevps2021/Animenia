import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UserDataService } from '../shared/user-data.service';
import { SpaceService } from '../services/space.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-space-list',
  templateUrl: './space-list.component.html',
  styleUrls: ['./space-list.component.css']
})
export class SpaceListComponent implements OnInit {
  spaces;
  constructor(
    public userData: UserDataService,
    public dataService: DataService,
    public spaceService: SpaceService,  
    public router: Router,
    public route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.getList();
  }


  getList(){
    this.spaceService.getSpaceList().subscribe(res => {
      if(res.success){
       console.log(res.spaces);
       this.spaces = res.spaces; 
      }
    })
  }

  subscribe(id:string){
    this.spaceService.subscribeToSpace(id).subscribe(res =>{
      if(res.success){
        console.log(res.message);
      }
    })
  }

}
