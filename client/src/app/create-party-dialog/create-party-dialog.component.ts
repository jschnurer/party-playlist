import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-party-dialog',
  templateUrl: './create-party-dialog.component.html',
  styleUrls: ['./create-party-dialog.component.scss']
})
export class CreatePartyDialogComponent {
  userName = new FormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.userName.hasError("required")) {
      return "Your name is required!";
    }

    return "";
  }

  onCreatePartyClicked() {
    if (this.getErrorMessage()) {
      return;
    }
    
    // TODO: Call API to create the party, then shove the user over to that party's room.
  }
}
