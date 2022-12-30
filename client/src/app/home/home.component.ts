import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePartyDialogComponent } from '../create-party-dialog/create-party-dialog.component';
import { JoinPartyDialogComponent } from '../join-party-dialog/join-party-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public joinPartyDialog: MatDialog,
    public createPartyDialog: MatDialog) {}

  onJoinPartyClick() {
    this.joinPartyDialog.open(JoinPartyDialogComponent);
  }

  onCreatePartyClick() {
    this.createPartyDialog.open(CreatePartyDialogComponent);
  }
}
