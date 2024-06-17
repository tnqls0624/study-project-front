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

  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(["/lobby"]);
    }
  }

  async onSubmit() {
    try {
      const res = await this.authService.login(this.login_data);
      this.authService.saveToken(res.data.data);
      const info = await axios.get("http://localhost:3000/user/find-info", {
        headers: {
          Authorization: `Bearer ${res.data.data}`,
        },
      });
      localStorage.setItem("_id", info.data.data._id);
      localStorage.setItem("name", info.data.data.name);
      alert("로그인에 성공하셨습니다!");
      this.router.navigate(["/lobby"]);
    } catch (e) {
      alert("로그인에 실패하였습니다...");
    }
  }
}
