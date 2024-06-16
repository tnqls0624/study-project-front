import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import axios, { AxiosResponse } from "axios";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private router: Router) {}

  async login(credentials: {
    user_id: string;
    password: string;
  }): Promise<AxiosResponse<any, any>> {
    return axios.post("http://localhost:3000/user/login", credentials);
  }

  saveToken(token: string) {
    localStorage.setItem("accessToken", token);
  }

  getToken(): string {
    return localStorage.getItem("accessToken") as string;
  }

  logout() {
    localStorage.removeItem("accessToken");
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
