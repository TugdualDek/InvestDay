import { expressjwt } from "express-jwt";
const util = require("util");
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

function jwtMiddleware(req, res) {
  const middleware = expressjwt({
    secret: serverRuntimeConfig.secret || "secret",
    algorithms: ["HS256"],
  }).unless({
    path: [
      // public routes that don't require authentication
      "/api/auth/register",
      "/api/auth/login",
    ],
  });

  return util.promisify(middleware)(req, res);
}

export { jwtMiddleware };
