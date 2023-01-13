import Room from "models/playlist/Room";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketClientManagement } from "socketio/SocketClientManagement";

class RoomDb {
  private static _instance: RoomDb;
  private rooms: { [roomCode: string]: Room } = {};

  private constructor() {
    // Every 5 minutes, check for room cleanup.
    setInterval(this.runRoomCleanup, 300000);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public socketDisconnected(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    Object.keys(RoomDb.Instance.rooms).forEach(roomCode => {
      const room = RoomDb.Instance.getRoom(roomCode);

      if (room) {
        room.onUserDisconnected(socket.id);
      }
    });
  }

  public runRoomCleanup() {
    const now = new Date();

    Object.keys(RoomDb.Instance.rooms).forEach(roomCode => {
      const room = RoomDb.Instance.getRoom(roomCode);

      if (room
        && room.getExpirationDate() <= now) {
        // This room is too old and must be euthanized.
        room.destroySelf();
        delete RoomDb.Instance.rooms[roomCode];
      }
    });
  }

  public getRoom(roomCode: string | undefined): Room | undefined {
    if (!roomCode?.trim()) {
      return undefined;
    }

    return this.rooms[roomCode];
  }

  public createNewRoom(creatorUUId: string,
    socketServer: SocketClientManagement): Room {
    let roomCode = this.generateNewRoomCode(5);

    const usedRoomCodes = Object.keys(this.rooms);

    while (usedRoomCodes.indexOf(roomCode) > -1) {
      roomCode = this.generateNewRoomCode(5);
    }

    this.rooms[roomCode] = new Room({
      roomCode,
      ownerUUId: creatorUUId,
      socketServer,
    });

    return this.rooms[roomCode];
  }

  private generateNewRoomCode(length: number) {
    return Array(length).fill('x').join('').replace(/x/g, () => {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    }).toUpperCase();
  }
}

export default RoomDb;