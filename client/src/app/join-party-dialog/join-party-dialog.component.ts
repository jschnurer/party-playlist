import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-join-party-dialog',
  templateUrl: './join-party-dialog.component.html',
  styleUrls: ['./join-party-dialog.component.scss']
})
export class JoinPartyDialogComponent {
  roomCode = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<JoinPartyDialogComponent>,
  ) { }

  onJoinPartyClicked() {
    // TODO: Call service to check room code validity
    // and if error, put error into form field,
    // otherwise redirect user to the /playlist?party=:roomCode
    // route.

    this.roomCode.setErrors({
      roomNotFound: true,
    });
  }

  getErrorMessage() {
    if (this.roomCode.hasError("required")) {
      return "You must enter a value";
    }

    if (this.roomCode.hasError("roomNotFound")) {
      return "Party not found, man!";
    }

    return "";
  }
}
