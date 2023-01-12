# API Endpoints

#### POST /rooms
* Description: creates a new room, returns the new Code for that room.
* Response Code: HTTP201
* Response Body:

      {
        roomCode: string,
      }

#### GET /rooms/:roomCode
* Description: checks for room existence, returns its Code if it exists.
* Response Code: HTTP200
* Response Body:

      {
        roomCode: string,
      }

#### POST /rooms/:roomCode/songs
* Description: adds a new song to the room's pool then emits new "song_info" over socket connection.
* Request Headers: "user_uuid": string, "user_name": string
* Request Body:

      {
        youtubeVideoId: "", // required
        youtubeVideoTitle: "" // required
      }

#### POST /rooms/:roomCode/songs/playNext
* Description: tells the room to play the next song (if any).
* Response Body:

      {
        nowPlaying: string
      }

# Socket.io Messages

## Client messages (to server)

All socket messages send from the client to the server must have the eventName of "message" and include a JSON data object that must contain a `type` string defining which message is being sent.

### "joinRoom"
* Description: Joins a specific party playlist room to listen for events.
* Required Data:

      {
        type: "joinRoom",
        roomCode: string
      }

### "leaveRoom"
* Description: Leaves a specific party playlist room.
* Body Data:

      {
        type: "leaveRoom",
        roomCode: string
      }

## Server messages (to clients)

### "songInfo"
* Description: Sends song info to a specific room whenever that room's current song or next up song changes.
* Body Data:

      {
        now_playing: string | undefined,
        next_up: string | undefined
      }