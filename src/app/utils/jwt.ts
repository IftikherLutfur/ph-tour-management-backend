import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
  email?: string;
}

export const generateToken = (
  payload: MyJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string): MyJwtPayload => {
  return jwt.verify(token, secret) as MyJwtPayload;
};

