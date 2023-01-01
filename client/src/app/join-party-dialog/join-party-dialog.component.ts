import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PartyService } from '../services/party/party.service';
@Component({
  selector: 'app-join-party-dialog',
  templateUrl: './join-party-dialog.component.html',
  styleUrls: ['./join-party-dialog.component.scss']
})
export class JoinPartyDialogComponent {
  roomCode = new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9]+")]);
  userName = new FormControl('', [Validators.required]);

  constructor(private partyService: PartyService) { }

  onJoinPartyClicked() {
    if (this.getRoomCodeErrorMessage()
      || this.getUserNameErrorMessage()) {
      return;
    }

    // TODO: Call service to check room code validity
    // and if error, put error into form field,
    // otherwise redirect user to the /playlist?party=:roomCode
    // route.

    this.roomCode.setErrors({
      roomNotFound: true,
    });
  }

  getRoomCodeErrorMessage() {
    if (this.roomCode.hasError("required")) {
      return "You really do need to enter a party code.";
    }

    if (this.roomCode.hasError("pattern")) {
      return "Room codes only have letters and numbers.";
    }

    if (this.roomCode.hasError("roomNotFound")) {
      return "Party not found, man!";
    }

    return "";
  }

  getUserNameErrorMessage() {
    if (this.userName.hasError("required")) {
      return "What's your name?!";
    }

    return "";
  }

  forceAlphaNumericOnly(text: string) {
    return text.replaceAll(/[^a-zA-Z0-9]/, '').toUpperCase();
  }
}
