import IYoutubeSearchResultItem from "./IYoutubeSearchResultItem";

export default interface IYoutubeSearchResult {
  kind: "youtube#searchListResponse",
  etag: string,
  nextPageToken: string,
  prevPageToken: string,
  regionCode: string,
  pageInfo: {
    totalResults: number,
    resultsPerPage: number
  },
  items: IYoutubeSearchResultItem[],
}