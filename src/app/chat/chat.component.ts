import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms"; // Add FormsModule for ngModel
import axios from "axios";
import { ChatService } from "./chat.service";
import { Subscription } from "rxjs";

export enum Action {
  CONNECT = "CONNECT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  DISCONNECT = "DISCONNECT",
  SEND_MESSAGE = "SEND_MESSAGE",
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

  current_user_id: string = "666f823b7e1c08ddbea8993d";
  private socketSubscription: Subscription | undefined;
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService //
  ) {}

  async ngOnInit(): Promise<void> {
    this.chatService.connect();
    this.room_id = this.route.snapshot.params["room_id"];
    await this.loadMessages();
    // const message = this.socketService.getMessage("receive-message");
    // console.log(message);
    const _id = localStorage.getItem("_id") as string;

    this.chatService.join(this.room_id, _id);

    this.chatService.sendMessage("connecting", { _id });
    // 소켓 연결 설정 및 메시지 수신
    this.socketSubscription = this.chatService
      .onMessage("receive-message")
      .subscribe((message: any) => {
        console.log("receive:", message);
        switch (message.type) {
          case Action.CONNECT: {
            console.log(message);
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
            console.log("조인!");
            break;
          }

          case Action.DISCONNECT: {
            console.log("디스커넥!");
          }
        }

        // this.messages.push({
        //   id: message._id,
        //   content: message.content,
        //   name: message.user.name,
        //   user_id: message.user_id,
        // });
      });
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  async loadMessages(): Promise<void> {
    try {
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

  async sendMessage(): Promise<void> {
    if (this.new_message.trim()) {
      const name = localStorage.getItem("name");
      const messageData = {
        content: this.new_message,
        user: this.current_user_id,
        room: this.room_id,
        name,
      };

      this.chatService.sendMessage("send-message", messageData);

      this.new_message = "";
    } else {
      alert("메시지를 입력하세요.");
    }
  }
}
