import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AddVideoDialogComponent } from './add-video-dialog/add-video-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { JoinPartyDialogComponent } from './join-party-dialog/join-party-dialog.component';
import { PlayerComponent } from './player/player.component';
import { RoomComponent } from './room/room.component';
import { ConfigService } from './services/config/config.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { PartySocket } from './socketio/PartySocket';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HomeComponent,
    JoinPartyDialogComponent,
    SignInComponent,
    RoomComponent,
    AddVideoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YouTubePlayerModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatDividerModule,
  ],
  providers: [
    PartySocket,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return () => {
          return configService.loadConfig();
        };
      },
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
