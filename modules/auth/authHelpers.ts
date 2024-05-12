import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../types";

dotenv.config();
const { JWTSECRET: jwtSecret } =
  process.env;

export function generateToken(user: User, options?: any) {
    if (!jwtSecret)
      throw new Error(
        "JWTSecret undefined in env.  Define JWTSecret as JWTSECRET={jwtsecret} in .env"
      );
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        tenantId: user.tenantId,
        roles: user.roles,
        sites: user.tenant.sites,
      },
      jwtSecret,
      options
    );
  }