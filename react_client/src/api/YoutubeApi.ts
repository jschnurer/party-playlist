import settings from "../settings";
import { throwIfResponseError } from "../utilities/apiUtilities";
import IYoutubeSearchResult from "./types/IYoutubeSearchResult";

class YoutubeApi {
  async searchVideos(searchText: string, abortSignal?: AbortSignal): Promise<IYoutubeSearchResult> {
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?type=video&part=snippet&maxResults=25&q=${encodeURIComponent(searchText)}&key=${settings.youtubeApiKey}`, {
      signal: abortSignal,
      method: "GET",
    });

    await throwIfResponseError(response);

    return await response.json() as IYoutubeSearchResult;
  }
}

export default new YoutubeApi();