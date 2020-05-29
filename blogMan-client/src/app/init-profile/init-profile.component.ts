import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import { ProfileService } from '../services/profile.service';
import { User} from '../shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-init-profile',
  templateUrl: './init-profile.component.html',
  styleUrls: ['./init-profile.component.css']
})
export class InitProfileComponent implements OnInit {

  constructor(
    public usering: UserDataService,
    public data: DataService, 
    public router: Router,
    public route: ActivatedRoute, 
    public profileService: ProfileService ) { }

  ngOnInit() {
  }
  id:string;
  profile={
    personalInfos:{
      firstName: '',
      lastName: '',
      birthDate:{
        day: '',
        month: '',
        year:''
      },
      telephone:''

    }
  }

  initProfile(){
    const profile ={
      personalInfos:{
        firstName: this.profile.personalInfos.firstName,
        lastName:  this.profile.personalInfos.lastName,
        birthDate: new Date(parseInt(this.profile.personalInfos.birthDate.year),parseInt(this.profile.personalInfos.birthDate.month)-1, parseInt(this.profile.personalInfos.birthDate.day )),
        telephone: this.profile.personalInfos.telephone
      }
    }
    this.id = this.route.snapshot.params['id'];
    return this.profileService.initProfile(this.id, profile).subscribe(profile =>{
      this.router.navigate([`user/${this.id}/profile`]);

    })
  }

}
