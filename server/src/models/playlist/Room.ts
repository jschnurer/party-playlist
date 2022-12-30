import { SocketClientManagement } from "socketio/SocketClientManagement";
import ISong from "./ISong";

export default class Room {
  /** The code of the room this playlist represents. */
  private roomCode: string;
  /** The list of all songs that have been suggested. */
  private songs: ISong[] = [];
  /** The song currently playing. */
  private currentSong: ISong | undefined;
  /** The uuid of the room owner. */
  private ownerUUId: string;
  /** The socket.io server. */
  private socketServer: SocketClientManagement;

  constructor(properties: IPlaylistConstructorArgs) {
    this.roomCode = properties.roomCode;
    this.ownerUUId = properties.ownerUUId;
    this.socketServer = properties.socketServer;
  }

  getOwnerUUId() {
    return this.ownerUUId;
  }

  getRoomCode() {
    return this.roomCode;
  }

  getCurrentSong() {
    return this.currentSong;
  }

  getNextSong(): ISong | undefined {
    const contributorUUIDs = Array.from(new Set(this.songs.map(x => x.contributedByUUId)));

    const currSongId = this.currentSong?.youtubeVideoId;

    // Get the following info for each contributor:
    //  * The number of this person's songs that have been played.
    //  * The next song suggestion contributed by this person.
    const contributionInfo = contributorUUIDs.map(contributorUUID => {
      const contributedSongs = this.songs.filter(x => x.contributedByUUId === contributorUUID);
      const nextSuggestion = contributedSongs.filter(x => !x.wasPlayed && x.youtubeVideoId !== currSongId)?.[0];

      return {
        contributorUUID,
        numPlayed: contributedSongs.filter(x => x.wasPlayed).length,
        nextSuggestion: nextSuggestion,
      };
    }).filter(x => x.nextSuggestion);

    contributionInfo
      .sort((a, b) => {
        if (a.numPlayed < b.numPlayed) {
          // If a has had fewer of their songs played, choose a.
          return -1;
        } else if (a.numPlayed > b.numPlayed) {
          // If b has had fewer of their songs played, choose b.
          return 1;
        } else {
          // If they have had the same amount played, check who contributed the next song earlier.
          if (a.nextSuggestion
            && !b.nextSuggestion) {
            // If a has a suggestion but not b, choose a.
            return -1;
          } else if (!a.nextSuggestion
            && b.nextSuggestion) {
            // If b has a suggestion but not a, choose b.
            return 1;
          } else if (a.nextSuggestion.addedTimestamp < b.nextSuggestion.addedTimestamp) {
            // If a's suggestion was first, choose a.
            return -1;
          } else if (a.nextSuggestion.addedTimestamp > b.nextSuggestion.addedTimestamp) {
            // If b's suggestion was first, choose b.
            return 1;
          } else {
            // They both contributed a song simultaneously.
            // God, I don't know this would be possible. Just pick a.
            return -1;
          }
        }
      });

    if (!contributionInfo.length) {
      // There is no next contribution!
      return undefined;
    }

    // Find the next song by someone other that the contributor of the current song.
    const nextByNotCurrentUser = contributionInfo
      .filter(x => x.contributorUUID !== this.getCurrentSong()?.contributedByUUId)
      ?.[0]?.nextSuggestion;

    // Return the next non-current-user's song or, if there is no one, the next
    // song by anyone.
    return nextByNotCurrentUser ?? contributionInfo[0].nextSuggestion;
  }

  addSong(song: ISong) {
    this.songs.push(song);

    console.debug(`Added song with videoId '${song.youtubeVideoId}' to room '${this.roomCode}'.`);

    this.emitSocketInfo();
  }

  playNextSong(): ISong | undefined {
    if (this.currentSong) {
      this.currentSong.wasPlayed = true;
    }

    const nextSong = this.getNextSong();

    if (nextSong) {
      this.currentSong = nextSong;
    }

    console.debug(`Next song is now '${nextSong?.youtubeVideoId}' in room '${this.roomCode}'.`);

    this.emitSocketInfo();

    return nextSong;
  }

  emitSocketInfo() {
    const songInfo = {
      now_playing: this.getCurrentSong()?.title,
      next_up: this.getNextSong()?.title,
    };

    this.socketServer
      .io
      .to(`ROOM_${this.roomCode}`)
      .emit("songInfo", songInfo);

    console.debug(`Emitted ${JSON.stringify(songInfo)} to ROOM_${this.roomCode}.`);
  }
}

export interface IPlaylistConstructorArgs {
  roomCode: string,
  ownerUUId: string,
  socketServer: SocketClientManagement,
}