import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // 추가된 부분

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { LobbyComponent } from "./lobby/lobby.component";
import { SignupComponent } from "./signup/signup.component";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [AppComponent, LoginComponent, LobbyComponent, SignupComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
