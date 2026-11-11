import { Request, Response } from "express";
import { getAllUsers } from "../services/user.service";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách người dùng",
    });
  }
};
