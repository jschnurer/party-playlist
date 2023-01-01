import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, distinct, Subject, Subscription, takeUntil } from 'rxjs';
import IConfig from 'src/models/IConfig';
import IUser from 'src/models/IUser';
import { UserService } from '../services/auth/user.service';
import { ConfigService } from '../services/config/config.service';
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
  private routeSub!: Subscription;
  roomCode: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(configService: ConfigService,
    userService: UserService,
    private partySocket: PartySocket,
    private route: ActivatedRoute) {
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
      .subscribe(roomCode => this.onRoomCodeChange(roomCode))
  }

  ngOnInit() {
    this.routeSub = this.route
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
