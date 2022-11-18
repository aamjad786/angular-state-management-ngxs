import { User } from '../models/user';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { AddUser, UpdateUser, DeleteUser, SetSelectedUser, GetUsers } from '../actions/user.action';
import { Injectable } from '@angular/core';
import { SharedService } from '../service/shared.service';
import { tap } from "rxjs/operators";


export class UserStateModel {
    Users: User[];
    selectedUser: User;
    ApiUsers:any[];
    usersLoaded:boolean
}

@State<UserStateModel>({
    name: 'Users',
    defaults: {
        Users: [],
        selectedUser: null,
        ApiUsers:[],
        usersLoaded:false
    }
})

@Injectable()
export class UserState {

    constructor(private sharedService: SharedService ) {
    }

    @Selector()
    static getUserList(state: UserStateModel) {
        return state.Users;
    }

    @Selector()
    static getUsersLoaded(state: UserStateModel) {
        return state.usersLoaded;
    }

    @Selector()
    static getUserListFromApi(state: UserStateModel) {
        return state.ApiUsers;
    }

    @Selector()
    static getSelectedUser(state: UserStateModel) {
        return state.selectedUser;
    }

    @Action(AddUser)
    addUser({getState, patchState}: StateContext<UserStateModel>, {payload}: AddUser) {
        const state = getState();
        const UserList = [...state.Users];
        payload.id = UserList.length + 1;
        patchState({
            Users: [...state.Users, payload]
        });
        return;
    }

    @Action(UpdateUser)
    updateUser({getState, setState}: StateContext<UserStateModel>, {payload, id}: UpdateUser) {
        const state = getState();
        const UserList = [...state.Users];
        const UserIndex = UserList.findIndex(item => item.id === id);
        UserList[UserIndex] = payload;
        setState({
            ...state,
            Users: UserList,
        });
        return;
    }


    @Action(DeleteUser)
    deleteUser({getState, setState}: StateContext<UserStateModel>, {id}: DeleteUser) {
        const state = getState();
        const filteredArray = state.Users.filter(item => item.id !== id);
        setState({
            ...state,
            Users: filteredArray,
        });
        return;
    }

    @Action(SetSelectedUser)
    setSelectedUserId({getState, setState}: StateContext<UserStateModel>, {payload}: SetSelectedUser) {
        const state = getState();
        setState({
            ...state,
            selectedUser: payload
        });
        return;
    }


    @Action(GetUsers)
    getUsers({getState, setState}: StateContext<UserStateModel>) {
        const state = getState();
        console.log("get user action called ");
        
       return this.sharedService.getUsers().pipe(tap(res=>{
            setState({
                ...state,
                ApiUsers:res.data,
                usersLoaded:true
            })

        }));

        // this.sharedService.getUsers().subscribe(res=>console.log("service call ",res.data));
        
        
        // setState({
        //     ...state,
        //     selectedUser: payload
        // });
        return;
    }
}