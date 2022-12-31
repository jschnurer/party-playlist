import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IUser from 'src/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: BehaviorSubject<IUser> = new BehaviorSubject<IUser>({ name: "" });

  constructor() {
    this.loadUserFromLocalStorage();
  }

  setUser(user: IUser) {
    window.localStorage.setItem("user", JSON.stringify(user));
    this.user.next(user);
  }

  private loadUserFromLocalStorage() {
    const localStorageUserData = window.localStorage.getItem("user");

    if (localStorageUserData) {
      try {
        const localUser = JSON.parse(localStorageUserData);
        if (localUser) {
          this.user.next({
            name: localUser.name?.toString() || "",
          });
        }
      } catch { }
    }
  }
}
