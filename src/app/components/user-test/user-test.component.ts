import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserState } from 'src/app/states/user.state';
import { GetUsers } from 'src/app/actions/user.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-test',
  templateUrl: './user-test.component.html',
  styleUrls: ['./user-test.component.css']
})
export class UserTestComponent implements OnInit {

  @Select(UserState.getUserListFromApi) getUserListFromApi$: Observable<any>;
  @Select(UserState.getUsersLoaded) getUsersLoaded$: Observable<any>;

  constructor(private store: Store,private router: Router) { }

  ngOnInit(): void {

    // this.store.dispatch(new GetUsers());
    this.getUsersLoaded$.subscribe(isUsersLoaded=>{
      if(!isUsersLoaded){
        this.store.dispatch(new GetUsers());
      }
    });
    
  }

  return(){
    this.router.navigate(['user-form']);
  }

}
