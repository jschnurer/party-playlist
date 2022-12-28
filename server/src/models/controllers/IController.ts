import { Router } from "express";

export default interface IController {
  baseRoute: string,
  router: Router,
}