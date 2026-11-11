import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Đăng nhập thất bại");
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">AutoSocial AI</h1>

          <p className="mt-2 text-slate-400">
            Đăng nhập để quản lý nội dung mạng xã hội
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Mật khẩu
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
