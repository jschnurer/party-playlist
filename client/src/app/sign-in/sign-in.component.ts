import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/auth/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  userName = new FormControl('', [Validators.required, Validators.maxLength(20)]);

  constructor(private userService: UserService) {

  }

  getUserNameErrorMessage() {
    if (this.userName.hasError("required")) {
      return "What's your name?!";
    }

    return "";
  }

  onSetNameClicked() {
    const name = this.userName.value;

    if (!name
      || this.getUserNameErrorMessage()) {
      return;
    }

    this.userService.setUser({
      name,
    });
  }
}
