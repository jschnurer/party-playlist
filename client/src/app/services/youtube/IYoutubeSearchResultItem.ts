export default interface IYoutubeSearchResultItem {
  kind: "youtube#searchResult",
  etag: string,
  id: {
    kind: string,
    videoId: string,
    channelId: string,
    playlistId: string
  },
  snippet: {
    publishedAt: Date,
    channelId: string,
    title: string,
    description: string,
    thumbnails: {
      default: {
        url: string,
        width: number,
        height: number,
      },
    },
    channelTitle: string,
    liveBroadcastContent: string,
    publishtime: Date,
  }
}