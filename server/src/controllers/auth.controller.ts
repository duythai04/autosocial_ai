import { Request, Response } from "express";
import { ZodError } from "zod";

import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from "../services/auth.service";

import { registerSchema, loginSchema } from "../validators/auth.validator";

const COOKIE_NAME = "refresh_token";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
  });
}

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: error.issues,
      });
    }

    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể đăng ký tài khoản",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await loginUser(email, password);

    setRefreshCookie(res, result.refreshToken);

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: error.issues,
      });
    }

    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể đăng nhập",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const rawToken = req.cookies?.[COOKIE_NAME];

    if (typeof rawToken !== "string") {
      return res.status(401).json({
        success: false,
        message: "Không có Refresh Token",
      });
    }

    const result = await refreshSession(rawToken);

    setRefreshCookie(res, result.refreshToken);

    return res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch {
    clearRefreshCookie(res);

    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập đã hết hạn",
    });
  }
}

export async function logout(req: Request, res: Response) {
  const rawToken = req.cookies?.[COOKIE_NAME];

  if (typeof rawToken === "string") {
    await logoutUser(rawToken);
  }

  clearRefreshCookie(res);

  return res.json({
    success: true,
    message: "Đăng xuất thành công",
  });
}
