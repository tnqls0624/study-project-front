import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DialogComponent } from "../dialog/dialog.component";
import axios from "axios";
import { ChatService } from "../chat/chat.service";

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.css"],
})
export class LobbyComponent implements OnInit {
  chat_rooms: Array<{ id: string; name: string }> = [];
  new_room = {
    name: "",
  };
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.disConnect();
    setTimeout(() => {
      this.loadChatRooms();
    }, 500);
  }

  async loadChatRooms(): Promise<void> {
    try {
      const res = await axios.get("http://localhost:3000/room/find-all");
      const rooms: any[] = res.data.data;

      this.chat_rooms = rooms.map((room, idx) => {
        return {
          id: room._id,
          name: room.title,
        };
      });
    } catch (e) {
      console.error(e);
    }
  }

  enterRoom(room_id: string): void {
    this.router.navigate(["/chat", room_id]);
  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }
}
