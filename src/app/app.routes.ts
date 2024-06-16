import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { LobbyComponent } from "./lobby/lobby.component";
import { AuthGuard } from "./auth/auth.guard";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sign-up", component: SignupComponent },
  { path: "login", component: LoginComponent },
  {
    path: "lobby",
    component: LobbyComponent,
    canActivate: [AuthGuard],
  },
];
