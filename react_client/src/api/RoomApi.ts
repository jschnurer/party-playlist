import { apiGetJson, getApiUrl, throwIfResponseError } from "../utilities/apiUtilities";
import IRoomExistenceResponse from "./types/IRoomExistenceResponse";

class RoomApi {
  async checkRoomExists(roomCode: string, abortSignal?: AbortSignal): Promise<IRoomExistenceResponse> {
    const response = await apiGetJson(getApiUrl(`/rooms/${roomCode}`), abortSignal);

    await throwIfResponseError(response, { [404]: "That room doesn't exist!" });

    return {
      roomCode,
      exists: true,
    };
  }
}

export default new RoomApi();