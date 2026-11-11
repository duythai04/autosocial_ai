import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await logout();

      navigate("/login", { replace: true });
    } catch {
      setError("Không thể hoàn tất đăng xuất trên máy chủ. Vui lòng thử lại.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-blue-400">AutoSocial AI</h1>

          <div className="flex items-center gap-5">
            <span className="text-sm text-slate-300">
              Xin chào, {user?.name || user?.email}
            </span>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          <p className="mt-2 text-slate-400">
            Quản lý hoạt động mạng xã hội của bạn tại một nơi.
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-6 text-red-400">
            {error}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">Facebook Pages</h3>

            <p className="mt-3 text-sm text-slate-400">
              Kết nối và quản lý các Fanpage Facebook.
            </p>

            <span className="mt-5 inline-block text-sm text-blue-400">
              Sắp ra mắt
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">AI Content Generator</h3>

            <p className="mt-3 text-sm text-slate-400">
              Tạo nội dung bài đăng bằng trí tuệ nhân tạo.
            </p>

            <span className="mt-5 inline-block text-sm text-blue-400">
              Sắp ra mắt
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">Post Scheduler</h3>

            <p className="mt-3 text-sm text-slate-400">
              Lên lịch và tự động đăng bài.
            </p>

            <span className="mt-5 inline-block text-sm text-blue-400">
              Sắp ra mắt
            </span>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-semibold">Thông tin tài khoản</h3>

          <div className="space-y-3 text-sm">
            <p>
              <span className="text-slate-400">Tên: </span>
              {user?.name || "Chưa cập nhật"}
            </p>

            <p>
              <span className="text-slate-400">Email: </span>
              {user?.email}
            </p>

            <p>
              <span className="text-slate-400">User ID: </span>
              {user?.id}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
