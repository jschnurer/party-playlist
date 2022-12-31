import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import IUser from 'src/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Subject<IUser> = new Subject<IUser>();

  constructor() {
    this.loadUserFromLocalStorage();
  }

  setUser(user: IUser) {
    window.localStorage.setItem("user", JSON.stringify(user));
    this.user.next(user);
  }

  private loadUserFromLocalStorage() {
    // Load the user data from localStorage if it exists.
    const localStorageUserData = window.localStorage.getItem("user");

    let userWasSet = false;

    if (localStorageUserData) {
      try {
        const localUser = JSON.parse(localStorageUserData);
        if (localUser) {
          this.setUser({
            name: localUser.name?.toString() || "",
          });
          userWasSet = true;
        }
      } catch { }
    }

    if (!userWasSet) {
      this.setUser({
        name: "",
      });
    }
  }
}
