import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: AuthUser | null;
}

export type AuthUser = {
  _id: string;
  email: string;
  role: string | null;
  name?: string;
  image?: string;
  restaurantId: string;
};

type DecodedUser = JwtPayload & {
  user?: AuthUser;
};

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    const cookieToken = req.cookies?.accessToken as string | undefined;
    const token = bearerToken || cookieToken;
    console.log("tokeb",token)
console.log("cookies", req.cookies)
console.log("headers", req.headers.cookie)

    if (!token) {
      res.status(401).json({
        message: "Please Login - Token Missing",
      });
      return;
    }

    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;


    if (!decodedValue || !decodedValue.userId) {
      res.status(401).json({
        message: "Invalid Token",
      });
      return;
    }

    req.user = {
      _id: decodedValue.userId,
      email: decodedValue.email,
      restaurantId: decodedValue.restaurantId,
      role: decodedValue.role,
      // ...(decodedValue.user.name ? { name: decodedValue.user.name } : {}),
      // ...(decodedValue.user.image ? { image: decodedValue.user.image } : {}),
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Please Login - JWT Error",
    });
  }
};


export const isSeller = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  if (user && user.role !== "seller") {
    res.status(401).json({
      message: "You are not Authorized Seller"
    });
    return;
  }
  next()
}