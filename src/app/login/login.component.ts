import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import axios from "axios";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}
  login_data = {
    user_id: "",
    password: "",
  };

  async onSubmit() {
    try {
      const res = await this.authService.login(this.login_data);
      console.log(res);
      this.authService.saveToken(res.data.data);
      alert("로그인에 성공하셨습니다!");
      this.router.navigate(["/lobby"]);
    } catch (e) {
      alert("로그인에 실패하였습니다...");
    }
  }
}
