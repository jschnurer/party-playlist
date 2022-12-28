import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinPartyDialogComponent } from '../join-party-dialog/join-party-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public dialog: MatDialog) {}

  onJoinPartyClick() {
    this.dialog.open(JoinPartyDialogComponent);
  }

  onCreatePartyClick() {
    alert("CREATE PARTY");
  }
}
