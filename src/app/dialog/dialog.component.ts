import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import axios from "axios";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { ChatService } from "../chat/chat.service";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./dialog.component.html",
  styleUrl: "./dialog.component.css",
})
export class DialogComponent {
  constructor(
    private readonly router: Router,
    public dialogRef: MatDialogRef<DialogComponent>,
    private readonly authService: AuthService,
    private chatService: ChatService
  ) {}

  @Input()
  title: string = "";
  onClose(): void {
    this.dialogRef.close();
  }

  async createRoom(): Promise<void> {
    if (this.title.trim()) {
      try {
        const token = this.authService.getToken();
        const res = await axios.post(
          "http://localhost:3000/room/create-room",
          {
            title: this.title,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.dialogRef.close(this.title);
        this.chatService.refreshRoom();
        this.router.navigate([
          "chat",
          res.data.data._id,
          { title: this.title },
        ]);
      } catch (e) {
        alert("채팅방 개설에 실패하였습니다.");
      }
    } else {
      alert("채팅방 이름을 입력해주세요.");
    }
  }
}
