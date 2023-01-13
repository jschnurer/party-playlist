import http from "http";
import RoomDb from "roomDb";
import * as SocketIO from "socket.io";

export class SocketClientManagement {
  public io: SocketIO.Server;
  private messageListeners: IMessageListener[] = [];

  constructor(server: http.Server) {

    const socketIo = require("socket.io");
    // Create a socket.io connection to the http server.
    this.io = socketIo(server, {
      cors: {
        origin: "*",
      },
    });
  }

  addMessageListener(messageListener: IMessageListener) {
    this.messageListeners.push(messageListener);
  }

  handleMessage(data: any, socket: SocketIO.Socket) {
    this.messageListeners
      .filter(x => x.messageType === data.type)
      .forEach(x => x.listener(data, socket, this.io));
  }

  start() {
    const self = this;

    // Set up io connections.
    this.io.on("connection", (socket) => {
      console.log(`Socket client ${socket.id} connected.`);

      socket.on("message", (data) => {
        self.handleMessage(data, socket);
      });

      socket.on('disconnect', () => {
        console.log(`Socket client ${socket.id} disconnected.`);
        RoomDb.Instance.socketDisconnected(socket);
      });
    });
  }
}

export type IMessageHandler = (data: any, socket: SocketIO.Socket, ioServer?: SocketIO.Server) => void;

export interface IMessageListener {
  messageType: string,
  listener: IMessageHandler,
}