import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ Observable } from 'rxjs/Observable';
import { UserDataService } from '../shared/user-data.service';
import { DataService } from '../data.service';
import {map} from 'rxjs/operators';

@Injectable()
export class AdminService {

  constructor(public http: HttpClient) { }

  addSpace(space:any):any{
    return this.http.post(`http://localhost:3000/space/admin/add-space`, space);
  }
}
