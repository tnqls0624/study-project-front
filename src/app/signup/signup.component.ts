import { Component, Renderer2 } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import axios from "axios";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.css",
})
export class SignupComponent {
  constructor(
    private readonly router: Router,
    private readonly renderer: Renderer2
  ) {}
  signup_data = {
    name: "",
    user_id: "",
    password: "",
  };

  async onSubmit() {
    this.renderer.addClass(document.body, "modal-open");

    try {
      await axios.post("http://localhost:3000/user/sign-up", this.signup_data);

      this.router.navigate(["/login"]);

      alert("회원가입 되셨습니다!");
    } catch (e) {
      alert("회원가입에 실패하였습니다...");
    }
  }
}
