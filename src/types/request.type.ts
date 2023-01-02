import type { NextApiRequest, NextApiResponse } from "next";

export interface Request extends NextApiRequest {
  auth: {
    sub: number;
    isAdmin: boolean;
  };
}
