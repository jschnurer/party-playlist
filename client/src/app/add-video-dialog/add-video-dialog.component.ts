import { Component, EventEmitter, Output } from '@angular/core';
import IYoutubeSearchResult from '../services/youtube/IYoutubeSearchResult';
import IYoutubeSearchResultItem from '../services/youtube/IYoutubeSearchResultItem';
import { YoutubeService } from '../services/youtube/youtube.service';

@Component({
  selector: 'app-add-video-dialog',
  templateUrl: './add-video-dialog.component.html',
  styleUrls: ['./add-video-dialog.component.scss']
})
export class AddVideoDialogComponent {
  @Output()
  addVideo = new EventEmitter<IYoutubeSearchResultItem>();

  searchTerm: string = "";
  searchResult: IYoutubeSearchResult | undefined = undefined;

  constructor(private youtubeService: YoutubeService) { }

  onSearchSubmit() {
    if (this.searchTerm.trim().length < 3) {
      return false;
    }

    this
      .youtubeService
      .searchVideos(this.searchTerm)
      .subscribe(x => this.searchResult = x);

    return true;
  }

  onSelectVideo(video: IYoutubeSearchResultItem) {
    this.addVideo.emit(video);
  }
}
