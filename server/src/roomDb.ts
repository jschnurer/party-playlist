import Room from "models/playlist/Room";
import { SocketClientManagement } from "socketio/SocketClientManagement";

class RoomDb {
  private static _instance: RoomDb;
  private rooms: { [name: string]: Room } = {};

  private constructor() {
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
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

    console.debug(`Created room '${roomCode}'.`);

    return this.rooms[roomCode];
  }

  private generateNewRoomCode(length: number) {
    return Array(length).fill('x').join('').replace(/x/g, () => {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    }).toUpperCase();
  }
}

export default RoomDb;