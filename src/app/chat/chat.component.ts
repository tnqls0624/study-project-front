import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { FormsModule } from "@angular/forms"; // Add FormsModule for ngModel
import axios from "axios";
import { ChatService } from "./chat.service";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";

export enum Action {
  CONNECT = "CONNECT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  DISCONNECT = "DISCONNECT",
  SEND_MESSAGE = "SEND_MESSAGE",
  REFRESH_ROOM = "REFRESH_ROOM",
}

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, OnDestroy {
  room_id!: string;
  messages: Array<{
    id: string;
    content: string;
    name: string;
    user_id: string;
  }> = [];

  new_message: string = "";
  title: string = "";

  current_user_id: string = "";
  private socket_sub: Subscription | undefined;
  private navigation_sub: Subscription;
  private hasNavigatedAway = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private chatService: ChatService
  ) {
    this.navigation_sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.hasNavigatedAway) {
        if (this.location.isCurrentPathEqualTo("/lobby")) {
          this.hasNavigatedAway = true; // 플래그 설정
          this.chatService.leave("leave-room", {
            room: this.room_id,
            user: this.current_user_id,
            name: localStorage.getItem("name"),
          });
          this.chatService.refreshRoom();
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.chatService.connect();
    this.room_id = this.route.snapshot.params["room_id"];
    this.title = this.route.snapshot.params["title"];
    await this.loadMessages();
    const _id = localStorage.getItem("_id") as string;
    this.current_user_id = _id;
    this.chatService.join(this.room_id, _id);

    this.chatService.sendMessage("connecting", { _id });
    // 소켓 연결 설정 및 메시지 수신
    this.socket_sub = this.chatService
      .onMessage("receive-message")
      .subscribe((message: any) => {
        switch (message.type) {
          case Action.CONNECT: {
            break;
          }

          case Action.SEND_MESSAGE: {
            this.messages.push({
              id: message._id,
              content: message.content,
              name: message.name,
              user_id: message.user,
            });
            break;
          }

          case Action.JOIN: {
            this.messages.push({
              id: "system",
              content: `${message.name}님이 참여하였습니다`,
              name: message.name,
              user_id: message.user,
            });
            break;
          }

          case Action.LEAVE: {
            this.leaveMessage(message);
            break;
          }

          case Action.DISCONNECT: {
            this.leaveMessage(message);
            break;
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.socket_sub) {
      this.socket_sub.unsubscribe();
    }
  }

  async loadMessages(): Promise<void> {
    try {
      this.messages = [];
      const res = await axios.get(
        `http://localhost:3000/chat/room/${this.room_id}/find-message`
      );
      this.messages = res.data.data.map(
        (message: {
          _id: string;
          content: string;
          user: { _id: string; name: string };
          user_id: string;
        }) => {
          return {
            id: message._id,
            content: message.content,
            name: message.user.name,
            user_id: message.user._id,
          };
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  leaveMessage(message: {
    id: string;
    content: string;
    name: string;
    master: string;
    user: string;
  }): void {
    this.messages.push({
      id: "system",
      content: `${message.name}님이 나가셨습니다`,
      name: message.name,
      user_id: message.user,
    });
    if (message.master === message.user) {
      alert("방장님이 나가셨습니다");
      this.chatService.disConnect();
      this.router.navigate(["/lobby"]);
    }
  }

  sendMessage(): void {
    if (this.new_message.trim()) {
      const name = localStorage.getItem("name");
      const message_data = {
        content: this.new_message,
        user: this.current_user_id,
        room: this.room_id,
        name,
      };

      this.chatService.sendMessage("send-message", message_data);

      this.new_message = "";
    } else {
      alert("메시지를 입력하세요.");
    }
  }

  leaveRoom(): void {
    const leave_data = {
      room: this.room_id,
      user: this.current_user_id,
    };
    this.chatService.leave("leave-room", leave_data);
  }
}
