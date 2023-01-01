import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, distinct, first, Subject, takeUntil } from 'rxjs';
import IConfig from 'src/models/IConfig';
import IUser from 'src/models/IUser';
import { AddVideoDialogComponent } from '../add-video-dialog/add-video-dialog.component';
import { UserService } from '../services/auth/user.service';
import { ConfigService } from '../services/config/config.service';
import { PartyService } from '../services/party/party.service';
import { PartySocket } from '../socketio/PartySocket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  onDestroy$: Subject<boolean> = new Subject();
  config!: IConfig;
  user!: IUser;
  roomCode: BehaviorSubject<string> = new BehaviorSubject<string>("");
  addSongDialogRef: MatDialogRef<AddVideoDialogComponent> | undefined;

  constructor(configService: ConfigService,
    userService: UserService,
    private partySocket: PartySocket,
    private partyService: PartyService,
    private route: ActivatedRoute,
    public addSongDialog: MatDialog) {
    configService
      .config
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(x => this.config = x);

    userService
      .user
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(x => this.user = x);

    this.roomCode
      .pipe(takeUntil(this.onDestroy$), distinct())
      .subscribe(roomCode => this.onRoomCodeChange(roomCode));
  }

  ngOnInit() {
    this.route
      .params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(params => {
        if (params["roomCode"]) {
          this.roomCode.next(params["roomCode"]);
        }
      });
  }

  onRoomCodeChange(roomCode: string) {
    if (!roomCode) {
      return;
    }

    this.partySocket.emit("joinRoom", { roomCode });
  }

  onEmitMsgClicked() {
    const roomCode = this.roomCode.getValue();
    this.emitSocketMessage("joinRoom", { roomCode, });
  }

  emitSocketMessage(messageType: string, data: any) {
    this.partySocket.emit("message", {
      ...data,
      type: messageType,
    });
  }

  onAddSongClicked() {
    this.addSongDialogRef = this.addSongDialog.open(AddVideoDialogComponent, {
      panelClass: "fullscreen-dialog",
    });

    this.addSongDialogRef
      .componentInstance
      .addVideo
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(x => {
        this.partyService.addSong(this.roomCode.getValue(), {
          title: x.snippet.title,
          videoId: x.id.videoId,
        }, this.user.name,
          // TODO: Handle uuid better.
          "uuid").subscribe(x => {
            console.log("song added?");
          });
      });

    this.addSongDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(_ => this.addSongDialogRef
        ?.componentInstance
        .addVideo
        .unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
