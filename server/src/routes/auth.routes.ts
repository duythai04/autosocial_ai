import { Router, Response } from "express";
import prisma from "../config/prisma";

import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller";

import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin người dùng",
    });
  }
});

export default router;
