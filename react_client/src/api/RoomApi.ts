import { apiGetJson, apiPostJson, getApiUrl, throwIfResponseError } from "../utilities/apiUtilities";
import IAddVideoRequest from "./types/IAddVideoRequest";
import IRoomExistenceResponse from "./types/IRoomExistenceResponse";

class RoomApi {
  async checkRoomExists(roomCode: string, abortSignal?: AbortSignal): Promise<IRoomExistenceResponse> {
    const response = await apiGetJson(getApiUrl(`/rooms/${roomCode}`), abortSignal);

    await throwIfResponseError(response, { [404]: "That room doesn't exist!" });

    const json = await response.json();

    if (!json.roomCode?.toString()?.trim()) {
      throw Error("That room doesn't exist!");
    }

    return {
      roomCode: json.roomCode.toString().trim(),
      exists: true,
    };
  }

  async createRoom(abortSignal?: AbortSignal): Promise<string> {
    const response = await apiPostJson(getApiUrl("/rooms"), {}, abortSignal);

    await throwIfResponseError(response);

    return (await response.json())?.roomCode;
  }

  async addVideo(roomCode: string, video: IAddVideoRequest, abortSignal?: AbortSignal): Promise<void> {
    const response = await apiPostJson(getApiUrl(`/rooms/${roomCode}/songs`), video, abortSignal);

    await throwIfResponseError(response);
  }

  async playNext(roomCode: string, abortSignal?: AbortSignal): Promise<void> {
    const response = await apiPostJson(getApiUrl(`/rooms/${roomCode}/songs/playNext`), {}, abortSignal);
    await throwIfResponseError(response);
  }
}

export default new RoomApi();