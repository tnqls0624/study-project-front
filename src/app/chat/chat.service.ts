import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { Observable } from "rxjs";
import { fromEvent } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3000/ws-1", {
      transports: ["websocket"],
    });
  }

  disConnect(): void {
    this.socket.disconnect();
  }

  connect(): void {
    this.socket.connect();
  }

  join(room_id: string, user_id: string): void {
    this.socket.emit("join-room", { room: room_id, user: user_id });
  }

  leave(event_name: string, data: any) {
    this.socket.emit(event_name, data);
  }

  getSocket(): Socket {
    return this.socket;
  }

  onMessage(event_name: string): Observable<any> {
    return fromEvent(this.socket, event_name);
  }

  sendMessage(event_name: string, data: any): void {
    this.socket.emit(event_name, data);
  }

  refreshRoom(): void {
    this.socket.emit("refresh-message");
  }
}
