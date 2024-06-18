import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DialogComponent } from "../dialog/dialog.component";
import axios from "axios";
import { ChatService } from "../chat/chat.service";
import { Action } from "../chat/chat.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.css"],
})
export class LobbyComponent implements OnInit {
  chat_rooms: Array<{
    id: string;
    title: string;
    master: string;
  }> = [];
  new_room = {
    name: "",
  };
  private socketSubscription: Subscription | undefined;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loadChatRooms();
    this.socketSubscription = this.chatService
      .onMessage("receive-message")
      .subscribe((message: any) => {
        if (message.type === Action.REFRESH_ROOM) {
          this.loadChatRooms();
        }
      });
  }

  async loadChatRooms(): Promise<void> {
    try {
      this.chat_rooms = [];
      const res = await axios.get("http://localhost:3000/room/find-all");
      const rooms: any[] = res.data.data;
      this.chat_rooms = rooms.map((room, idx) => {
        return {
          id: room._id,
          title: room.title,
          master: room.master[0].name,
        };
      });
    } catch (e) {
      console.error(e);
    }
  }

  enterRoom(room_id: string, title: string): void {
    this.router.navigate(["/chat", room_id, { title }]);
  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }
}
