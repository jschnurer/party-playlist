import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import IYoutubeSearchResult from './IYoutubeSearchResult';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  apiKey: string = 'YOUR-APIKEY-YOUTUBE';

  constructor(public http: HttpClient,
    private config: ConfigService) { }

  searchVideos(searchText: string): Observable<Object> {
    return this.http
      .get<IYoutubeSearchResult>(this.getVideoSearchUrl(searchText));
  }

  private getVideoSearchUrl(searchText: string) {
    const ytApiKey = this.config.config.getValue().youtubeApiKey;
    return `https://youtube.googleapis.com/youtube/v3/search?type=video&part=snippet&maxResults=25&q=${encodeURIComponent(searchText)}&key=${ytApiKey}`;
  }
}