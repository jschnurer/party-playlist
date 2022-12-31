import { Component } from '@angular/core';
import IUser from 'src/models/IUser';
import { UserService } from './services/auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'party-playlist';
  user!: IUser;

  constructor(private userService: UserService) {
    this.userService.user.subscribe(user => this.user = user);
  }
}
