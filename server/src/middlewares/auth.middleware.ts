import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
    return;
  }

  const token = authorization.slice(7);

  try {
    req.userId = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Access Token không hợp lệ hoặc đã hết hạn",
    });
  }
}
