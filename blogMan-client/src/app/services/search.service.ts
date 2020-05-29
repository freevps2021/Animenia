import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ Observable } from 'rxjs/Observable';
import { UserDataService } from '../shared/user-data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


@Injectable()
export class SearchService {

  constructor(private http: HttpClient, private userData: UserDataService) { }

  searchItems: Observable<any[]>;

  debouncedSearch(terms:Observable<string>){
    return terms.debounceTime(900).distinctUntilChanged().switchMap(term => this.search(term));
  }
  search(term:string){
    return this.http.get(`http://localhost:3000/users/search-users?name=${term}`);
  }

 



}
