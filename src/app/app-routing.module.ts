import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import { ChatComponent } from "./chat/chat.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sign-up", component: SignupComponent },
  { path: "login", component: LoginComponent },
  {
    path: "lobby",
    loadChildren: () =>
      import("./lobby/lobby.module").then((m) => m.LobbyModule),
    canActivate: [AuthGuard],
  },
  { path: "chat/:room_id", component: ChatComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
