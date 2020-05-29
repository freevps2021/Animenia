import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import {map} from 'rxjs/operators';

@Injectable()
export class SpaceService {

  constructor(public http : HttpClient) { }

  // get all available spaces which are not subscribed yet...
  getSpaceList():any{
    return this.http.get(`http://localhost:3000/space/spaces-list`);
  }

  // adding new space for admin privilages
  addSpace(spaceship){
    return this.http.post(`http://localhost:3000/space/add-space`, spaceship);
  }

  // subscribe to certain space...
  subscribeToSpace(id:string):any{
    return this.http.post(`http://localhost:3000/space/subscribe?space_id=${id}`, null);
  }

  unsubscribeSpace(id:string):any{
    return this.http.post(`http://localhost:3000/space/unsubscribe?id=${id}`, null)
  }

  launchSpaceship(id: string){
    return this.http.get(`http://localhost:3000/space/${id}`);
  }

  getSpaceTimeline(id: string){
    return this.http.get(`http://localhost:3000/space/${id}/timeline`);

  }

}
