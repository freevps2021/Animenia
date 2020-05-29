import { Component, OnInit, OnChanges } from '@angular/core';
import { UserDataService } from '../shared/user-data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../services/search.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public userService: UserDataService, public router: Router, public searchService: SearchService) { }
  searchTerms = new Subject<string>();
  term;
  isSearching;
  displayResult;
  searchResults:any;
  loggedIn: boolean;
  id: string;
  authUser;

  ngOnInit() {
    // reset login status after init.
    if(this.userService.checkAuth()){
      this.userService.setLoginstatus(true);
      this.checkLogin();

    }else{
      this.router.navigate(['/login']);
    }

 

  }
  
    // returns the current login status from the behavior subject as observable.
  checkLogin(){
    this.userService.currentLoginStatus.subscribe(isLoggedIn =>{
      this.loggedIn = isLoggedIn;
      if(this.loggedIn){
        // get current user if after init.
      this.userService.currentUser.subscribe(user => {
       if(user !== null){
        this.authUser = user;
        this.id = this.authUser._id;
      }
      });
      
      }
    })
  }

  logout(){
      this.userService.logOut();
      this.userService.setLoginstatus(false);
      this.router.navigate(['/login']);

  }

  // set search engine for user
  searchUsers(term:string){
    if(term !== ''){
      this.searchTerms.next(this.term);
      this.searchService.debouncedSearch(this.searchTerms).subscribe(result =>{
        this.searchResults = result;
        if(this.searchResults.searchResult.length > 0){
          this.displayResult=true;

        }
      })
    }
   
  }
 
}
