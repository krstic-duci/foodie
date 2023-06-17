import { Response } from "express";
import { Request as JWTRequest } from "express-jwt";

export interface CustomContext {
  req: JWTRequest;
  res: Response;
}
