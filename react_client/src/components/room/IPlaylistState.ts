import ISong from "./ISong";

export default interface IPlaylistState {
  nowPlaying?: ISong,
  nextUp?: ISong,
  roomOwner: string,
}