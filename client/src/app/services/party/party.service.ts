import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import IConfig from 'src/models/IConfig';
import IYoutubeVideo from 'src/models/IYoutubeVideo';
import ICreatePartyResponse from 'src/models/party/ICreatePartyResponse';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private config!: IConfig;

  constructor(private http: HttpClient,
    configService: ConfigService) {
    configService.config.subscribe(config => this.config = config);
  }

  createParty() {
    return this.http.post<ICreatePartyResponse>(`${this.config.baseApiEndpoint}/rooms`, null);
  }

  joinParty(roomCode: string) {

  }

  addSong(roomCode: string,
    youtubeVideo: IYoutubeVideo) {

  }

  playNextSong(roomCode: string) {

  }
}
