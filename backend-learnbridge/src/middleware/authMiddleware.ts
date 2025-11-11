import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/BlacklistedToken";


interface DecodedUser {
    userId: string;
    studentId: string;
    name?: string;
    email?: string;
    isTutor?: boolean;
    [key: string]: any; // allows flexibility for more fields
}

export const checkBlacklistedToken = async (
      req: Request,
      res: Response,
      next: NextFunction
) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const blacklisted = await BlacklistedToken.findOne({ token });
      if (blacklisted) return res.status(401).json({ message: "Token is blacklisted" });

      next();
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Access Denied. No token provided" });


  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided" });

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) return res.status(401).json({ message: "Token is blacklisted" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;

    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}
