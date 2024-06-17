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

  // 연결된 소켓 인스턴스를 반환
  getSocket(): Socket {
    return this.socket;
  }

  // 메시지 수신
  onMessage(eventName: string): Observable<any> {
    return fromEvent(this.socket, eventName);
  }

  // 메시지 전송
  sendMessage(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
