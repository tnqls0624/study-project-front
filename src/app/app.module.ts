import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // 추가된 부분
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { LobbyComponent } from "./lobby/lobby.component";
import { SignupComponent } from "./signup/signup.component";
import { AppRoutingModule } from "./app-routing.module";
import { DialogComponent } from "./dialog/dialog.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChatComponent } from "./chat/chat.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent,
    SignupComponent,
    DialogComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
