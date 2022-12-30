export default interface ISong {
  youtubeVideoId: string,
  title: string,
  contributedByUUId: string,
  contributorHandle: string,
  wasPlayed: boolean,
  addedTimestamp: Date,
}