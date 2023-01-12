import ISong from "../../../components/room/ISong";

export default interface ISongInfoMessage {
  nowPlaying?: ISong,
  nextUp?: ISong,
  roomOwner?: string,
}
