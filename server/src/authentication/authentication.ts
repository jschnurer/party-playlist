import { Request } from "express";
import IUser from "models/playlist/IUser";
import { v4 } from "uuid";
import ApiError from "validation/ApiError";
import ErrorTypes from "validation/ErrorTypes";

export function getNewUserUUId() {
  return v4();
}

export function getUserInfoFromRequest(req: Request): IUser {
  const name = req.headers.user_name;
  const uuid = req.headers.user_uuid;

  if (!name) {
    throw new ApiError("user_name request header is required.", ErrorTypes.BadRequest);
  }

  if (!uuid) {
    throw new ApiError("user_uuid request header is required.", ErrorTypes.BadRequest);
  }

  if (Array.isArray(name)) {
    throw new ApiError("user_name request header must be a string.", ErrorTypes.BadRequest);
  }

  if (Array.isArray(uuid)) {
    throw new ApiError("user_uuid request header must be a string.", ErrorTypes.BadRequest);
  }

  return {
    uuid,
    name,
  }
}