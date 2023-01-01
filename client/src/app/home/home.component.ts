import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JoinPartyDialogComponent } from '../join-party-dialog/join-party-dialog.component';
import { PartyService } from '../services/party/party.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public joinPartyDialog: MatDialog,
    public addVideoDialog: MatDialog,
    private partyService: PartyService,
    private router: Router) { }

  onJoinPartyClick() {
    this.joinPartyDialog.open(JoinPartyDialogComponent);
  }

  onCreatePartyClick() {
    this.partyService.createParty().subscribe(result => {
      // TODO: Save yourUUID somewhere.
      // result.yourUUID

      this.router.navigateByUrl("party/" + result.roomCode);
    });
  }
}
