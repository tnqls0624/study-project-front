import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LobbyComponent } from "./lobby.component";

@NgModule({
  declarations: [LobbyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: LobbyComponent,
      },
    ]),
  ],
})
export class LobbyModule {}
