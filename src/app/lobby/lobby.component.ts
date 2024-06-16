import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.css"],
})
export class LobbyComponent implements OnInit {
  chatRooms: Array<{ id: string; name: string }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadChatRooms();
  }

  loadChatRooms(): void {
    // 예시로 하드코딩된 데이터 사용
    this.chatRooms = [
      { id: "1", name: "일반 채팅방" },
      { id: "2", name: "프로그래밍 채팅방" },
      { id: "3", name: "게임 채팅방" },
    ];
    console.log(this.chatRooms);
  }

  enterRoom(roomId: string): void {
    // 선택한 채팅방으로 이동
    this.router.navigate(["/chat", roomId]);
  }

  createRoom(): void {
    // 새로운 채팅방 생성 로직 (예시)
    const newRoomId = (this.chatRooms.length + 1).toString();
    const newRoomName = `새 채팅방 ${newRoomId}`;
    this.chatRooms.push({ id: newRoomId, name: newRoomName });
  }
}
