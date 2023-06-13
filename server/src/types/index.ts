import { Request, Response } from "express";

import { User } from "@entity/User";

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
}
